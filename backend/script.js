const fs = require('fs');
const csvParser = require('csv-parser');
const { Client } = require('pg');

const connectionString = 'postgres://root:secret@localhost:5432/postgres'; // Replace with your PostgreSQL connection details

const csvFilePath = 'books.csv'; // Replace with the actual path to your CSV file


async function createTable() {
  const client = new Client({
    connectionString,
  });

  try {
    await client.connect();

    const query = `
    CREATE TABLE IF NOT EXISTS books (
      id SERIAL PRIMARY KEY,
      isbn VARCHAR(13) UNIQUE NOT NULL,
      book_title VARCHAR(255) NOT NULL,
      book_author VARCHAR(255) NOT NULL,
      year_of_publication INTEGER,
      publisher VARCHAR(255) NOT NULL,
      image_url_s VARCHAR(255) NOT NULL,
      image_url_m VARCHAR(255) NOT NULL,
      image_url_l VARCHAR(255) NOT NULL
    );
    `;

    await client.query(query);
    console.log('Table "books" created successfully.');
  } catch (err) {
    console.error('Error creating table:', err);
  } finally {
    client.end();
  }
}

async function insertData() {
    const client = new Client({
      connectionString,
    });
  
    try {
      await client.connect();
  
      const readStream = fs.createReadStream(csvFilePath);
      let rowCount = 0;
      let values = [];
  
      readStream
      .pipe(csvParser())
      .on('data', (row) => {
        rowCount++;
        const yearOfPublication = parseInt(row.year_of_publication);
        const yearIsValid = Number.isInteger(yearOfPublication) && yearOfPublication > 0;
        const imageUrlL = row.image_url_l || ''; // Set a default value if 'image_url_l' is null in the CSV file
  
        values.push([
          row.isbn,
          row.book_title,
          row.book_author,
          yearIsValid ? yearOfPublication : null, // Set to null if not a valid integer
          row.publisher,
          row.image_url_s,
          row.image_url_m,
          imageUrlL, // Use the default value for 'image_url_l'
        ]);
  
        // Insert in batches of 1000 rows for better performance
        if (rowCount % 1000 === 0) {
          insertBatch(client, values);
          values = [];
        }
      })
      .on('end', async () => {
        // Insert any remaining rows
        if (values.length > 0) {
          await insertBatch(client, values);
        }
        console.log(`Successfully inserted ${rowCount} rows into the 'books' table.`);
        client.end();
      });
    } catch (err) {
      console.error('Error inserting data:', err);
    }
  }
  
  async function insertBatch(client, values) {
    const placeholders = values.map((_, rowIndex) => `(${values[rowIndex].map((_, i) => `$${rowIndex * 8 + i + 1}`).join(', ')})`).join(', ');
    const flattenedValues = values.reduce((acc, row) => acc.concat(row), []); // Flatten the values array
  
    const query = `
      INSERT INTO books (isbn, book_title, book_author, year_of_publication, publisher, image_url_s, image_url_m, image_url_l)
      VALUES ${placeholders}
    `;
  
    try {
      await client.query(query, flattenedValues);
    } catch (err) {
      console.error('Error inserting batch:', err);
    }
  }

// Create the 'books' table first
createTable().then(() => {
  // Once the table is created, insert the data
  insertData();
});