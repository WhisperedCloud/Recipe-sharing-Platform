const express = require('express');
const router = express.Router({ mergeParams: true }); // Important for accessing parent router params like :recipeId
const { addComment, getCommentsByRecipe, deleteComment } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

// Nested routes: /api/recipes/:recipeId/comments
router.route('/')
  .post(protect, addComment)
  .get(getCommentsByRecipe);

// Direct route: /api/comments/:id
router.route('/:id')
  .delete(protect, deleteComment);

module.exports = router;
