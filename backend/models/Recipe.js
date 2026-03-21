const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Recipe = sequelize.define('Recipe', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  ingredients: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false }, // Array of strings
  instructions: { type: DataTypes.TEXT, allowNull: false },
  cookingTime: { type: DataTypes.INTEGER, allowNull: false }, // in minutes
  image: { type: DataTypes.STRING, allowNull: true }
});

module.exports = Recipe;
