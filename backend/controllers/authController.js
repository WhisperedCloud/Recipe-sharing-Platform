const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register new user
// @route   POST /api/auth/register
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    
    const userExists = await User.findOne({ where: { email } });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password });
    
    if (user) {
      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user.id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (user && (await user.matchPassword(password))) {
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user / clear token
// @route   POST /api/auth/logout
const logoutUser = (req, res) => {
  // Normally tokens are cleared on the client-side by destroying the JWT.
  // We can just send a success message.
  res.json({ message: 'Logged out successfully' });
};

module.exports = { registerUser, loginUser, logoutUser };
