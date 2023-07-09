"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const http_status_1 = __importDefault(require("http-status"));
const ApiError = require('./utils/ApiError');
const app = (0, express_1.default)();
// parse json request body
app.use(express_1.default.json());
// parse urlencoded request body
app.use(express_1.default.urlencoded({ extended: true }));
// enable cors
app.use((0, cors_1.default)());
app.options("*", (0, cors_1.default)());
app.use("api/v1", routes_1.default);
// send back a 404 error for any unknown request
app.use((req, res, next) => {
    next(new ApiError(http_status_1.default.NOT_FOUND, "Not found"));
});
exports.default = app;
