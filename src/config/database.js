const { Sequelize } = require("sequelize");
require("dotenv").config();

// Create a new instance of Sequelize for PostgreSQL
const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: false, // Disable SQL logging
});

module.exports = sequelize;
