import httpStatus from "http-status";
import { Request, Response } from "express";
import { Pool } from "pg"; // Import the pg Pool

// Create a new instance of the Pool with your PostgreSQL connection details
const pool = new Pool({
  user: "root",
  host: "localhost",
  database: "postgres",
  password: "secret",
  port: 5432, // Default PostgreSQL port is 5432
});

export const getBooks = async (req: Request, res: Response) => {
  try {
    const searchKey = req.query.searchKey || "";
    const cursor = req.query.cursor || 0;
    const limit = req.query.limit || 10;
    let count;


    // Base query string
    let query = `SELECT * FROM "Books" WHERE`;

    // Check if the searchKey exists and add the appropriate search condition
    if (searchKey.length) {
      query += ` (book_author ILIKE '%${searchKey}%' OR book_title ILIKE '%${searchKey}%') AND`;
    }

    // Add the cursor condition
    query += ` id > ${cursor} ORDER BY id ASC LIMIT ${limit}`;

    const { rows } = await pool.query(query);

    // get count
    if(!searchKey.length && cursor == 0) {
      console.log(true)
      count = await getCountOfBooks();
    }
    
    const nextCursor = rows.length > 0 ? rows[rows.length - 1].id : null;

    res.status(httpStatus.OK).json({ data: rows, nextCursor, count });
  } catch (error) {
    console.log(error, "ERROR EXECUTING SQL QUERY");
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

export const getCountOfBooks = async () => {
  try {
    const countQuery = `SELECT COUNT(*) AS total FROM "Books"`;
    const countResult = await pool.query(countQuery);
    const totalCount = countResult.rows[0].total;

    return totalCount;
  } catch (error) {
    console.log("error while getting count")
  }
}
