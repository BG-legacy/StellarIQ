const express = require('express');
const router = express.Router();
const { authMiddleware } = require('./authMiddleware');
const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout
} = require('./authController');

// Public routes (no authentication required)
router.post('/register', register);
router.post('/login', login);

// Protected routes (authentication required)
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.put('/change-password', authMiddleware, changePassword);
router.post('/logout', authMiddleware, logout);

// Health check route
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Auth service is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router; 