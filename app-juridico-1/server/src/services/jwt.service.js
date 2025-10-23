const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

const generateToken = (user) => {
  const payload = {
    id: user.id,
    role: user.role,
    username: user.username,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken,
};