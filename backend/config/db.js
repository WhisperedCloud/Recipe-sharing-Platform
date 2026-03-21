const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'recipe_db',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'postgres',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: false, // Set to true to see SQL queries in dev
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL Connected Successfully.');
  } catch (error) {
    console.error('❌ PostgreSQL Connection Failed:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
