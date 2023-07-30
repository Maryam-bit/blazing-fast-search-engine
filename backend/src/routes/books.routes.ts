import { Router } from "express";
import * as booksController from "../controllers/books.controller";
const router = Router();

router.route("/").get(booksController.getBooks)

export default router;