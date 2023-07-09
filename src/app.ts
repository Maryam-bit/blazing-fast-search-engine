import express from "express";
import cors from "cors";
import routes from "./routes";
import httpStatus from "http-status";
const ApiError = require('./utils/ApiError');

const app = express();

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// enable cors
app.use(cors());
app.options("*", cors());

app.use("api/v1", routes);

// send back a 404 error for any unknown request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

export default app;