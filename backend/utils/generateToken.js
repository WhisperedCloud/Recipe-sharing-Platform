const jwt = require('jsonwebtoken');
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_jwt_key_123!', { expiresIn: '30d' });
};
module.exports = generateToken;
