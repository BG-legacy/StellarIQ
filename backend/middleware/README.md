# Middleware

This directory contains middleware functions that process requests before they reach the route handlers.

## Structure

- `authMiddleware.js` - JWT token validation and user authentication
- `validationMiddleware.js` - Request data validation
- `errorMiddleware.js` - Error handling middleware
- `rateLimitMiddleware.js` - Rate limiting for API endpoints
- `loggingMiddleware.js` - Request logging and monitoring

## Usage

Middleware functions should:
- Be reusable across different routes
- Handle common concerns (auth, validation, logging)
- Follow the Express middleware pattern
- Be properly ordered in the middleware stack 