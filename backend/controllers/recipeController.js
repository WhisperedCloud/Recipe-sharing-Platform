const { Recipe, User, Comment, Like } = require('../models');

// @desc    Create a recipe
// @route   POST /api/recipes
const createRecipe = async (req, res, next) => {
  try {
    const { title, description, ingredients, instructions, cookingTime, image } = req.body;

    const recipe = await Recipe.create({
      userId: req.user.id,
      title, 
      description, 
      ingredients, 
      instructions, 
      cookingTime, 
      image
    });

    res.status(201).json(recipe);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all recipes
// @route   GET /api/recipes
const getRecipes = async (req, res, next) => {
  try {
    const recipes = await Recipe.findAll({
      include: [
        { model: User, attributes: ['id', 'name', 'authorImg'] },
        { model: Like, attributes: ['id', 'userId'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(recipes);
  } catch (error) {
    next(error);
  }
};

// @desc    Get recipe by ID
// @route   GET /api/recipes/:id
const getRecipeById = async (req, res, next) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ['id', 'name', 'authorImg'] },
        { 
          model: Comment, 
          include: [{ model: User, attributes: ['id', 'name'] }]
        },
        { model: Like, attributes: ['id', 'userId'] }
      ]
    });

    if (recipe) {
      res.json(recipe);
    } else {
      res.status(404).json({ message: 'Recipe not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update recipe
// @route   PUT /api/recipes/:id
const updateRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id);

    if (recipe) {
      // Check if user is the author
      if (recipe.userId !== req.user.id) {
        return res.status(401).json({ message: 'Not authorized to update this recipe' });
      }

      recipe.title = req.body.title || recipe.title;
      recipe.description = req.body.description || recipe.description;
      recipe.ingredients = req.body.ingredients || recipe.ingredients;
      recipe.instructions = req.body.instructions || recipe.instructions;
      recipe.cookingTime = req.body.cookingTime || recipe.cookingTime;
      recipe.image = req.body.image || recipe.image;

      const updatedRecipe = await recipe.save();
      res.json(updatedRecipe);
    } else {
      res.status(404).json({ message: 'Recipe not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete recipe
// @route   DELETE /api/recipes/:id
const deleteRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id);

    if (recipe) {
      // Check if user is the author
      if (recipe.userId !== req.user.id) {
        return res.status(401).json({ message: 'Not authorized to delete this recipe' });
      }

      await recipe.destroy();
      res.json({ message: 'Recipe removed' });
    } else {
      res.status(404).json({ message: 'Recipe not found' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { createRecipe, getRecipes, getRecipeById, updateRecipe, deleteRecipe };
