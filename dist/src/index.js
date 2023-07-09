"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = require("./config/config");
const port = process.env.PORT;
app_1.default.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${config_1.config.port}`);
});
