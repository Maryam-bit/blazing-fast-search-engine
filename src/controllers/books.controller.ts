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
        const query = `SELECT * from "Books" where book_author LIKE 'Ann%'`

        const { rows } = await pool.query(query);
        res.status(httpStatus.OK).json({ data: rows });
    }
    catch (error) {
        console.log(error, 'ERROR EXECUTING SQL QUERY');
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: "Internal server error"})
    }
}