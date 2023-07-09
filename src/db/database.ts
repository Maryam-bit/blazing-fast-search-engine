import { config } from "../config/config";
module.exports = {
	development: {
		username: config.postgres.user,
		password: config.postgres.password,
		database: config.postgres.database,
		host: config.postgres.host,
		dialect: config.postgres.dialect,
		port: config.postgres.port,
	},
	test: {
		username: config.postgres.user,
		password: config.postgres.password,
		database: config.postgres.database,
		host: config.postgres.host,
		dialect: config.postgres.dialect,
		port: config.postgres.port,
	},
	production: {
		username: config.postgres.user,
		password: config.postgres.password,
		database: config.postgres.database,
		host: config.postgres.host,
		dialect: config.postgres.dialect,
		port: config.postgres.port,
	},
};
