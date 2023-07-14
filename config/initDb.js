const { Sequelize } = require('sequelize');
const config = require('../config/env.config');

// Create a Sequelize instance
const sequelize = new Sequelize(`mysql://${config.mysql.username}:${config.mysql.password}@${config.mysql.host}:${config.mysql.port}`, {
  dialect: 'mysql',
  query: {
    raw: true, // Set raw to true to execute raw SQL queries
  },
});

// Raw SQL query to create the database
const createDatabaseQuery = `CREATE DATABASE IF NOT EXISTS ${config.mysql.database}`;

// Execute the raw query
sequelize.query(createDatabaseQuery)
  .then(() => {
    console.log('Database created successfully or already exists: ' + config.mysql.database);
  })
  .catch((error) => {
    console.error('Error creating database:', error);
  })
  .finally(() => {
    // Close the Sequelize connection
    sequelize.close();
});