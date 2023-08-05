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
        const searchKey = req.query.searchKey;
        const cursor = req.query.cursor || 0;
        const limit = req.query.limit || 10;


       // Base query string
      let query = `SELECT * FROM "Books" WHERE`;

      // Check if the searchKey exists and add the appropriate search condition
      if (searchKey) {
        query += ` (book_author ILIKE '%${searchKey}%' OR book_title ILIKE '%${searchKey}%') AND`;
      }

      // Add the cursor condition
      query += ` id > ${cursor} ORDER BY id ASC LIMIT ${limit}`;

        const { rows } = await pool.query(query);
        const nextCursor = rows.length > 0 ? rows[rows.length - 1].id : null;
        res.status(httpStatus.OK).json({ data: rows, nextCursor });
    }
    catch (error) {
        console.log(error, 'ERROR EXECUTING SQL QUERY');
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: "Internal server error"})
    }
}