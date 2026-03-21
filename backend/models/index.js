const { sequelize } = require('../config/db');
const User = require('./User');
const Recipe = require('./Recipe');
const Comment = require('./Comment');
const Like = require('./Like');

// User <-> Recipe (One to Many)
User.hasMany(Recipe, { foreignKey: 'userId', onDelete: 'CASCADE' });
Recipe.belongsTo(User, { foreignKey: 'userId' });

// User <-> Comment (One to Many)
User.hasMany(Comment, { foreignKey: 'userId', onDelete: 'CASCADE' });
Comment.belongsTo(User, { foreignKey: 'userId' });

// Recipe <-> Comment (One to Many)
Recipe.hasMany(Comment, { foreignKey: 'recipeId', onDelete: 'CASCADE' });
Comment.belongsTo(Recipe, { foreignKey: 'recipeId' });

// User <-> Like (One to Many)
User.hasMany(Like, { foreignKey: 'userId', onDelete: 'CASCADE' });
Like.belongsTo(User, { foreignKey: 'userId' });

// Recipe <-> Like (One to Many)
Recipe.hasMany(Like, { foreignKey: 'recipeId', onDelete: 'CASCADE' });
Like.belongsTo(Recipe, { foreignKey: 'recipeId' });

module.exports = { sequelize, User, Recipe, Comment, Like };
