# StellarIQ API Structure & Routing

## 📁 Folder Structure

```
backend/
├── controllers/          # Business logic handlers
├── middleware/           # Request processing middleware
├── models/              # Database models (existing)
├── routes/              # API route definitions
├── services/            # Business logic and external integrations
├── utils/               # Utility functions and helpers
├── config/              # Configuration files (existing)
├── auth/                # Authentication module (existing)
└── server.js            # Main server file
```

## 🛣️ API Routes

### Authentication (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `POST /logout` - User logout
- `POST /refresh-token` - Refresh JWT token
- `POST /forgot-password` - Request password reset
- `POST /reset-password` - Reset password
- `GET /verify-email/:token` - Verify email address

### User Management (`/api/user`)
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `DELETE /account` - Delete user account
- `PUT /change-password` - Change password
- `GET /preferences` - Get user preferences
- `PUT /preferences` - Update user preferences

### Career Planning (`/api/careers`)
- `POST /plans` - Create career plan
- `GET /plans` - Get all career plans
- `GET /plans/:id` - Get specific career plan
- `PUT /plans/:id` - Update career plan
- `DELETE /plans/:id` - Delete career plan
- `POST /plans/:id/goals` - Add goal to plan
- `PUT /plans/:id/goals/:goalId` - Update goal
- `DELETE /plans/:id/goals/:goalId` - Delete goal

### Skills Assessment (`/api/skills`)
- `POST /assessments` - Create skills assessment
- `GET /assessments` - Get all assessments
- `GET /assessments/:id` - Get specific assessment
- `PUT /assessments/:id` - Update assessment
- `DELETE /assessments/:id` - Delete assessment
- `POST /assessments/:id/skills` - Add skill to assessment
- `PUT /assessments/:id/skills/:skillId` - Update skill
- `DELETE /assessments/:id/skills/:skillId` - Delete skill
- `GET /categories` - Get skill categories

### Career Pivot (`/api/pivot`)
- `POST /plans` - Create pivot plan
- `GET /plans` - Get all pivot plans
- `GET /plans/:id` - Get specific pivot plan
- `PUT /plans/:id` - Update pivot plan
- `DELETE /plans/:id` - Delete pivot plan
- `POST /plans/:id/steps` - Add step to plan
- `PUT /plans/:id/steps/:stepId` - Update step
- `DELETE /plans/:id/steps/:stepId` - Delete step
- `POST /plans/:id/analysis` - Generate pivot analysis

### AI Integration (`/api/ai`)
- `POST /chat` - Send AI chat message
- `GET /chat/history` - Get chat history
- `DELETE /chat/history` - Clear chat history
- `POST /analyze/career` - Analyze career path
- `POST /analyze/skills` - Analyze skills gap
- `POST /analyze/pivot` - Analyze pivot opportunities
- `POST /generate/insights` - Generate career insights
- `POST /generate/recommendations` - Generate recommendations
- `POST /generate/learning-path` - Generate learning path

## 🔧 Implementation Status

### ✅ Completed
- [x] Folder structure created
- [x] Route files created with placeholder endpoints
- [x] Server.js updated to include all routes
- [x] Route index file for easy importing
- [x] README files for each directory

### 🚧 Next Steps
- [ ] Implement controllers for each route
- [ ] Create middleware for authentication and validation
- [ ] Implement services for business logic
- [ ] Add utility functions
- [ ] Implement proper error handling
- [ ] Add request validation
- [ ] Set up rate limiting
- [ ] Add comprehensive testing

## 🚀 Getting Started

1. All routes are currently returning placeholder responses
2. Each route file contains TODO comments for implementation
3. Controllers, middleware, and services need to be implemented
4. Authentication middleware should be added to protected routes

## 📝 Notes

- All routes follow RESTful conventions
- Protected routes will need authentication middleware
- Error handling should be consistent across all endpoints
- Response formats should be standardized
- Input validation should be implemented for all endpoints 