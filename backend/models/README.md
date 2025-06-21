# StellarURL Database Models

This directory contains all the MongoDB/Mongoose models for the StellarURL career planning application.

## Models Overview

### 1. User Model (`User.js`)
Manages user accounts, authentication, and profile information.

**Key Features:**
- Secure password hashing with bcryptjs
- Email validation and uniqueness
- Profile information and career details
- Account status and preferences
- Public profile generation

**Main Fields:**
- `firstName`, `lastName`, `email`, `password` (required)
- `profilePicture`, `bio`, `location`
- `currentRole`, `currentCompany`, `yearsOfExperience`
- `isActive`, `isVerified`, `emailVerified`
- `preferences` (notifications, privacy)
- `lastLogin`

**Methods:**
- `comparePassword(candidatePassword)` - Verify password
- `getPublicProfile()` - Get profile without sensitive data

### 2. CareerPlan Model (`CareerPlan.js`)
Tracks career goals, milestones, and planning progress.

**Key Features:**
- Target role and company planning
- Milestone tracking with due dates
- Skills requirements and acquisition tracking
- Resource management
- Progress calculation

**Main Fields:**
- `user`, `title`, `description` (required)
- `targetRole`, `targetCompany`, `targetIndustry`, `targetSalary`
- `targetDate`, `estimatedDuration`
- `status`, `progress`
- `requiredSkills[]`, `milestones[]`, `resources[]`
- `notes`, `tags[]`, `isPublic`

**Methods:**
- `updateProgress()` - Calculate progress based on milestones
- `addMilestone(milestoneData)` - Add new milestone
- `completeMilestone(milestoneId)` - Mark milestone complete

### 3. SkillsAssessment Model (`SkillsAssessment.js`)
Manages skills evaluation and proficiency tracking.

**Key Features:**
- Categorized skills assessment
- Self-rating and confidence levels
- External assessment integration
- Results analysis and improvement areas
- Version tracking

**Main Fields:**
- `user`, `title`, `type` (required)
- `status`, `categories[]` (skills with ratings)
- `results` (analytics and insights)
- `externalAssessments[]`
- `duration`, `completedAt`
- `tags[]`, `isPublic`, `version`

**Methods:**
- `calculateResults()` - Analyze and update results
- `addSkill(categoryName, skillData)` - Add skill to category
- `updateSkillRating(categoryName, skillName, rating, confidence)` - Update skill rating

### 4. PivotPlan Model (`PivotPlan.js`)
Comprehensive career transition planning and execution tracking.

**Key Features:**
- Current to target role mapping
- Skills analysis (transferable, to develop, to acquire)
- Risk assessment and mitigation
- Financial planning
- Network and support system tracking
- Phased action planning

**Main Fields:**
- `user`, `title`, `currentRole`, `targetRole` (required)
- `pivotType`, `motivation`, `targetDate`
- `status`, `progress`
- `skillsAnalysis` (transferable, to develop, to acquire)
- `actionPlan` (phases with tasks)
- `risks[]`, `financialPlanning`
- `network` (mentors, connections, support)
- `notes`, `tags[]`, `isPublic`

**Methods:**
- `updateProgress()` - Calculate progress from tasks
- `addPhase(phaseData)` - Add new phase
- `completeTask(phaseIndex, taskIndex)` - Mark task complete
- `addRisk(riskData)` - Add risk assessment

### 5. AIChatLog Model (`AIChatLog.js`)
Tracks AI-powered career guidance conversations and insights.

**Key Features:**
- Session-based chat logging
- Message history with metadata
- Analytics and insights extraction
- Action item tracking
- User feedback collection
- Privacy and retention controls

**Main Fields:**
- `user`, `sessionId` (required)
- `title`, `context` (topic, goal, user context)
- `messages[]` (with roles, content, metadata)
- `status`, `analytics`
- `aiModel` (configuration)
- `startTime`, `endTime`, `lastActivity`
- `feedback`, `isPrivate`, `retentionPeriod`
- `tags[]`

**Methods:**
- `addMessage(messageData)` - Add new message
- `endSession()` - Complete session
- `addActionItem(actionItem)` - Add action item
- `completeActionItem(actionItemIndex)` - Mark action complete
- `addInsight(insightData)` - Add insight
- `submitFeedback(feedbackData)` - Submit user feedback
- `getSummary()` - Get session summary

## Usage Examples

### Importing Models
```javascript
// Import individual models
const { User } = require('./models/User');
const { CareerPlan } = require('./models/CareerPlan');

// Or import all models
const { User, CareerPlan, SkillsAssessment, PivotPlan, AIChatLog } = require('./models');
```

### Creating a User
```javascript
const user = new User({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  password: 'securepassword123',
  currentRole: 'Software Engineer',
  currentCompany: 'Tech Corp'
});

await user.save();
```

### Creating a Career Plan
```javascript
const careerPlan = new CareerPlan({
  user: user._id,
  title: 'Senior Developer Career Plan',
  targetRole: 'Senior Software Engineer',
  targetCompany: 'Google',
  targetDate: new Date('2025-12-31'),
  requiredSkills: [
    {
      skill: 'System Design',
      priority: 'high',
      isAcquired: false
    }
  ]
});

await careerPlan.save();
```

### Adding Skills Assessment
```javascript
const skillsAssessment = new SkillsAssessment({
  user: user._id,
  title: 'Technical Skills Review',
  type: 'self-assessment',
  categories: [{
    name: 'Programming Languages',
    skills: [{
      name: 'JavaScript',
      selfRating: 8,
      confidenceLevel: 9,
      proficiencyLevel: 'advanced'
    }]
  }]
});

await skillsAssessment.save();
await skillsAssessment.calculateResults();
```

### Creating a Pivot Plan
```javascript
const pivotPlan = new PivotPlan({
  user: user._id,
  title: 'Transition to Data Science',
  currentRole: 'Software Engineer',
  targetRole: 'Data Scientist',
  pivotType: 'function-change',
  targetDate: new Date('2025-06-30'),
  motivation: {
    primary: 'career-growth',
    description: 'Want to work with data and ML'
  }
});

await pivotPlan.save();
```

### Logging AI Chat
```javascript
const chatLog = new AIChatLog({
  user: user._id,
  sessionId: 'session-' + Date.now(),
  title: 'Career Planning Session',
  context: {
    topic: 'career-planning',
    userGoal: 'Transition to product management'
  }
});

await chatLog.addMessage({
  role: 'user',
  content: 'I want to transition from engineering to product management',
  messageType: 'question'
});

await chatLog.save();
```

## Database Indexes

All models include optimized indexes for common query patterns:

- **User**: Email, name combinations
- **CareerPlan**: User + status, target date
- **SkillsAssessment**: User + status, completion date
- **PivotPlan**: User + status, target date, pivot type
- **AIChatLog**: User + status, session ID, start time

## Validation

All models include comprehensive validation:

- Required field validation
- String length limits
- Enum value validation
- Number range validation
- Email format validation
- Password strength requirements

## Security Features

- Password hashing with bcryptjs
- Sensitive data exclusion in public profiles
- Privacy controls for sharing
- Data retention policies
- Input sanitization and validation

## Testing

Run model tests with:
```bash
npm run test:models
```

This will test:
- Model instantiation
- Validation rules
- Custom methods
- Virtual properties
- Database operations 