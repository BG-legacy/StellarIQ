const express = require('express');
const router = express.Router();

// TODO: Import career controller and auth middleware when created
// const { createPlan, getPlans, updatePlan, deletePlan, getPlanById } = require('../controllers/careerController');
// const { authenticateToken } = require('../middleware/authMiddleware');

// Career planning routes (protected)
router.post('/plans', (req, res) => {
  res.json({ message: 'Create career plan endpoint - TODO: Implement' });
});

router.get('/plans', (req, res) => {
  res.json({ message: 'Get all career plans endpoint - TODO: Implement' });
});

router.get('/plans/:id', (req, res) => {
  res.json({ message: 'Get career plan by ID endpoint - TODO: Implement' });
});

router.put('/plans/:id', (req, res) => {
  res.json({ message: 'Update career plan endpoint - TODO: Implement' });
});

router.delete('/plans/:id', (req, res) => {
  res.json({ message: 'Delete career plan endpoint - TODO: Implement' });
});

router.post('/plans/:id/goals', (req, res) => {
  res.json({ message: 'Add goal to career plan endpoint - TODO: Implement' });
});

router.put('/plans/:id/goals/:goalId', (req, res) => {
  res.json({ message: 'Update goal in career plan endpoint - TODO: Implement' });
});

router.delete('/plans/:id/goals/:goalId', (req, res) => {
  res.json({ message: 'Delete goal from career plan endpoint - TODO: Implement' });
});

module.exports = router; 