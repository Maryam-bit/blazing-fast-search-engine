import { Router } from "express";
import testRoutes from "./tests.routes";

const router = Router();

const routes = [{ path: "/tests", route: testRoutes }];

routes.forEach(({ path, route }) => {
    router.use(path, route);
});

export default router;