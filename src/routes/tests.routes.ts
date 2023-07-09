import { Router } from "express";
import * as testsController from "../controllers/tests.controller";
const router = Router();

router.route("/testv1").get(testsController.testv1)

export default router;