const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const { authRoutes } = require('./auth');
const { 
  userRoutes, 
  careersRoutes, 
  skillsRoutes, 
  pivotRoutes, 
  aiRoutes 
} = require('./routes');

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to StellarIQ API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      user: '/api/user',
      careers: '/api/careers',
      skills: '/api/skills',
      pivot: '/api/pivot',
      ai: '/api/ai',
      health: '/api/health'
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/careers', careersRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/pivot', pivotRoutes);
app.use('/api/ai', aiRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'StellarIQ API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 StellarIQ API server running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api/health`);
}); 