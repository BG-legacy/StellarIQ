const authRoutes = require('./authRoutes');
const { authMiddleware, optionalAuthMiddleware } = require('./authMiddleware');
const authController = require('./authController');

module.exports = {
  authRoutes,
  authMiddleware,
  optionalAuthMiddleware,
  authController
}; 