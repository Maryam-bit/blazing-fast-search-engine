import { Router } from "express";
import testRoutes from "./tests.routes";
import bookRoutes from "./books.routes";

const router = Router();

const routes = [
    { path: "/tests", route: testRoutes },
    { path: "/books", route: bookRoutes }
];

routes.forEach(({ path, route }) => {
    router.use(path, route);
});

export default router;