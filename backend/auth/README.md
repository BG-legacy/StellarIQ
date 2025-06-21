# Authentication System

This directory contains the complete authentication system for StellarIQ, including user registration, login, JWT token management, and protected routes.

## Features

- ✅ User Registration with validation
- ✅ User Login with password verification
- ✅ JWT Token Generation and validation
- ✅ Password Hashing with bcryptjs
- ✅ Protected Route Middleware
- ✅ Profile Management
- ✅ Password Change functionality
- ✅ Comprehensive error handling
- ✅ Input validation and sanitization

## File Structure

```
auth/
├── authController.js    # Authentication logic and handlers
├── authMiddleware.js    # JWT verification middleware
├── authRoutes.js        # Express routes for auth endpoints
├── index.js            # Module exports
└── README.md           # This documentation
```

## API Endpoints

### Public Routes (No Authentication Required)

#### POST `/api/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt_token_here"
  }
}
```

#### POST `/api/auth/login`
Login with existing credentials.

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "isActive": true,
      "lastLogin": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt_token_here"
  }
}
```

### Protected Routes (Authentication Required)

All protected routes require the `Authorization` header with a Bearer token:
```
Authorization: Bearer <jwt_token>
```

#### GET `/api/auth/profile`
Get the current user's profile.

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "bio": "Software Engineer",
      "location": "San Francisco, CA",
      "currentRole": "Software Engineer",
      "currentCompany": "Tech Corp",
      "yearsOfExperience": 5,
      "isActive": true,
      "lastLogin": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### PUT `/api/auth/profile`
Update the current user's profile.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "bio": "Updated bio",
  "location": "New York, NY",
  "currentRole": "Senior Software Engineer",
  "currentCompany": "New Tech Corp",
  "yearsOfExperience": 6
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "firstName": "John",
      "lastName": "Smith",
      "email": "john.doe@example.com",
      "bio": "Updated bio",
      "location": "New York, NY",
      "currentRole": "Senior Software Engineer",
      "currentCompany": "New Tech Corp",
      "yearsOfExperience": 6
    }
  }
}
```

#### PUT `/api/auth/change-password`
Change the user's password.

**Request Body:**
```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

#### POST `/api/auth/logout`
Logout the current user (client-side token removal).

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### GET `/api/auth/health`
Health check endpoint for the authentication service.

**Response:**
```json
{
  "success": true,
  "message": "Auth service is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Middleware

### `authMiddleware`
Protects routes by verifying JWT tokens and ensuring user authentication.

**Usage:**
```javascript
const { authMiddleware } = require('./auth/authMiddleware');

// Protect a single route
app.get('/protected', authMiddleware, (req, res) => {
  // req.user contains the authenticated user
  res.json({ user: req.user });
});
```

### `optionalAuthMiddleware`
Optional authentication middleware that doesn't fail if no token is provided.

**Usage:**
```javascript
const { optionalAuthMiddleware } = require('./auth/authMiddleware');

// Optional authentication
app.get('/public-with-auth', optionalAuthMiddleware, (req, res) => {
  // req.user will be undefined if no valid token provided
  res.json({ user: req.user || null });
});
```

## Environment Variables

Make sure to set these environment variables in your `.env` file:

```env
# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Database
MONGO_URI=mongodb://localhost:27017/stellarurl

# Server
PORT=5000
NODE_ENV=development
```

## Testing

Run the authentication tests:

```bash
# Run all tests including auth
npm test

# Run only authentication tests
npm run test:auth

# Run specific test files
node test/test-auth.js
```

## Security Features

1. **Password Hashing**: All passwords are hashed using bcryptjs with salt rounds of 12
2. **JWT Tokens**: Secure token-based authentication with configurable expiration
3. **Input Validation**: Comprehensive validation for all user inputs
4. **Error Handling**: Secure error responses that don't leak sensitive information
5. **Account Status**: Support for deactivating user accounts
6. **Rate Limiting**: Can be easily added for additional security

## Error Handling

The authentication system provides consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"] // For validation errors
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created (registration)
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid credentials, missing token)
- `500` - Internal Server Error

## Usage Examples

### Frontend Integration

```javascript
// Register a new user
const registerUser = async (userData) => {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  const data = await response.json();
  if (data.success) {
    localStorage.setItem('token', data.data.token);
  }
  return data;
};

// Login user
const loginUser = async (credentials) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  const data = await response.json();
  if (data.success) {
    localStorage.setItem('token', data.data.token);
  }
  return data;
};

// Make authenticated requests
const getProfile = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/auth/profile', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return await response.json();
};
```

### Backend Integration

```javascript
// Protect routes in your application
const { authMiddleware } = require('./auth');

// Apply to specific routes
app.get('/api/protected-data', authMiddleware, (req, res) => {
  // req.user contains the authenticated user
  res.json({ data: 'Protected data', user: req.user });
});

// Apply to route groups
app.use('/api/admin', authMiddleware, adminRoutes);
```

## Troubleshooting

### Common Issues

1. **"JWT_SECRET is not defined"**
   - Make sure you have set the `JWT_SECRET` environment variable
   - Generate a strong secret key: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

2. **"Invalid token" errors**
   - Check that the token is being sent in the correct format: `Bearer <token>`
   - Ensure the token hasn't expired
   - Verify the JWT_SECRET matches between token generation and verification

3. **"User not found" errors**
   - The user account may have been deleted or deactivated
   - Check the database connection and user collection

4. **Password validation errors**
   - Ensure passwords meet the minimum requirements (8 characters)
   - Check that the password field is included in the request

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` in your environment variables. This will provide more detailed error messages. 