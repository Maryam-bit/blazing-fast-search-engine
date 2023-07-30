import sequelize from "./postgres";
import Sequelize from "sequelize";
import { readdirSync } from "fs";
import path from "path";
const modelsPath = path.join(__dirname, "../models");
const files = readdirSync(modelsPath);
const filteredModelFiles = files
	.filter((file) => file.indexOf(".") !== 0 && (file.slice(-3) === ".js" || file.slice(-3) === ".ts"))
	.map((modelFile) => path.join(modelsPath, modelFile));

const DB: any = {};

filteredModelFiles.forEach((modelPath) => {
	const { default: modelFunc } = require(`${modelPath}`);
	const model = modelFunc(sequelize, Sequelize.DataTypes);
	DB[model.name] = model;
});

Object.keys(DB).forEach((modelName) => {
	if (DB[modelName].associate) DB[modelName].associate(DB);
});

DB["sequelize"] = sequelize; // connection instance (RAW queries)
DB["Sequelize"] = Sequelize; // library

export default DB;
