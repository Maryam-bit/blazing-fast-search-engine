const fs = require('fs');
const csvParser = require('csv-parser');
const db = require('../db/index');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let transaction;
    try {
      const csvFilePath = 'books.csv'; // Replace with the actual path to your CSV file

      const data = await new Promise((resolve, reject) => {
        const dataArray = [];
        fs.createReadStream(csvFilePath)
          .pipe(csvParser())
          .on('data', (row) => {
            dataArray.push({
              isbn: row.isbn,
              book_title: row.book_title,
              book_author: row.book_author,
              year_of_publication: parseInt(row.year_of_publication) || null,
              publisher: row.publisher,
              image_url_s: row.image_url_s,
              image_url_m: row.image_url_m,
              image_url_l: row.image_url_l || '',
            });
          })
          .on('end', () => {
            resolve(dataArray);
          })
          .on('error', (err) => {
            reject(err);
          });
      });

      // Start the transaction
      transaction = await db.default.sequelize.transaction();

      // Perform data insertion inside the transaction
      await db.default.Book.bulkCreate(data, { transaction });

      // Commit the transaction
      await transaction.commit();

      console.log(`Data inserted successfully!`);
      console.log(`Number of rows inserted:`, data.length);
    } catch (err) {
      // Rollback the transaction if an error occurs
      if (transaction) {
        await transaction.rollback();
      }
      console.error(`Error inserting data:`, err);
    }
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Books', null, {});
  },
};
