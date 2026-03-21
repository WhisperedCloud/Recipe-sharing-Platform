const { Comment, Recipe } = require('../models');

// @desc    Add a comment to a recipe
// @route   POST /api/recipes/:recipeId/comments
const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    const { recipeId } = req.params;

    const recipe = await Recipe.findByPk(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const comment = await Comment.create({
      text,
      userId: req.user.id,
      recipeId
    });

    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
};

// @desc    Get comments for a recipe
// @route   GET /api/recipes/:recipeId/comments
const getCommentsByRecipe = async (req, res, next) => {
  try {
    const { recipeId } = req.params;
    
    // We can also fetch this via the recipe include, but this provides a dedicated route
    const comments = await Comment.findAll({
      where: { recipeId },
      include: [{ model: require('../models/User'), attributes: ['id', 'name', 'profilePicture'] }],
      order: [['createdAt', 'DESC']]
    });

    res.json(comments);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findByPk(req.params.id);

    if (comment) {
      // Ensure the user is the comment author
      if (comment.userId !== req.user.id) {
        return res.status(401).json({ message: 'Not authorized to delete this comment' });
      }
      await comment.destroy();
      res.json({ message: 'Comment removed' });
    } else {
      res.status(404).json({ message: 'Comment not found' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { addComment, getCommentsByRecipe, deleteComment };
