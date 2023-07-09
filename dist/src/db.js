"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = require("pg");
const config_1 = require("./config/config");
exports.pool = new pg_1.Pool({
    host: config_1.config.postgres.host,
    port: config_1.config.postgres.port,
    user: config_1.config.postgres.user,
    password: config_1.config.postgres.password,
    database: config_1.config.postgres.database
});
