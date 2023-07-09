import { Router } from "express";
import * as testsController from "../controllers/tests.controller";
const router = Router();

router.route("/setup").get(testsController.testv1)
router.route("/").get(testsController.testv1)
router.route("/").post(testsController.testv1)

export default router;