const express = require('express');
const router = express.Router({ mergeParams: true });
const { toggleLike, getLikesByRecipe } = require('../controllers/likeController');
const { protect } = require('../middleware/authMiddleware');

// Nested routes: /api/recipes/:recipeId/likes
router.route('/')
  .post(protect, toggleLike)
  .get(getLikesByRecipe);

module.exports = router;
