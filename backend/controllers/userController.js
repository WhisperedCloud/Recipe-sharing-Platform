const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
      user.authorImg = req.body.authorImg || user.authorImg;
      
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        bio: updatedUser.bio,
        authorImg: updatedUser.authorImg
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user profile
// @route   DELETE /api/users/profile
const deleteUserProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (user) {
      await user.destroy();
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (chefs)
// @route   GET /api/users
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'authorImg']
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

module.exports = { getUserProfile, updateUserProfile, deleteUserProfile, getAllUsers };
