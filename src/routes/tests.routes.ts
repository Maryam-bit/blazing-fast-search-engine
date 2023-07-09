import { Router } from "express";
import * as testsController from "../controllers/tests.controller";
const router = Router();

router.route("/").get(testsController.testGet)
router.route("/").post(testsController.testPost)

export default router;