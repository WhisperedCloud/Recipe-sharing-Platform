const { Like, Recipe } = require('../models');

// @desc    Toggle a like for a recipe
// @route   POST /api/recipes/:recipeId/likes
const toggleLike = async (req, res, next) => {
  try {
    const { recipeId } = req.params;

    const recipe = await Recipe.findByPk(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Check if user already liked
    const existingLike = await Like.findOne({
      where: {
        recipeId,
        userId: req.user.id
      }
    });

    if (existingLike) {
      // Unlike
      await existingLike.destroy();
      res.json({ message: 'Recipe unliked' });
    } else {
      // Like
      const like = await Like.create({
        recipeId,
        userId: req.user.id
      });
      res.status(201).json(like);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get likes for a recipe
// @route   GET /api/recipes/:recipeId/likes
const getLikesByRecipe = async (req, res, next) => {
  try {
    const { recipeId } = req.params;

    const likes = await Like.findAll({
      where: { recipeId },
      attributes: ['id', 'userId']
    });

    res.json(likes);
  } catch (error) {
    next(error);
  }
};

module.exports = { toggleLike, getLikesByRecipe };
