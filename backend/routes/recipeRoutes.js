const express = require('express');
const router = express.Router();
const { createRecipe, getRecipes, getRecipeById, updateRecipe, deleteRecipe, generateRecipe } = require('../controllers/recipeController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createRecipe)
  .get(getRecipes);

router.route('/generate')
  .post(protect, generateRecipe);

router.route('/:id')
  .get(getRecipeById)
  .put(protect, updateRecipe)
  .delete(protect, deleteRecipe);

module.exports = router;
