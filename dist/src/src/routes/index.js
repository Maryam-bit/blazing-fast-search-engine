"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tests_routes_1 = __importDefault(require("./tests.routes"));
const router = (0, express_1.Router)();
const routes = [{ path: "/tests", route: tests_routes_1.default }];
routes.forEach(({ path, route }) => {
    router.use(path, route);
});
exports.default = router;
