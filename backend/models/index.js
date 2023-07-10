'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
// const env = process.env.NODE_ENV || 'development';
// const config = require(__dirname + '/../config/userdb.config.json')[env];
const config = require('../config/env.config');
const db = {};

let sequelize;

if (config.use_env_variable) {
  sequelize = new Sequelize(config.mysql.database, config.mysql.username, config.mysql.password, config.mysql);
} else {
  sequelize = new Sequelize(config.mysql.database, config.mysql.username, config.mysql.password, config.mysql);
  console.log("🚀 ~ file: index.js:20 ~ config.database:", config.mysql.database)
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
