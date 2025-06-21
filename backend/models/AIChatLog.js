const mongoose = require('mongoose');

const aiChatLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Session Information
  sessionId: {
    type: String,
    required: [true, 'Session ID is required'],
    unique: true
  },
  title: {
    type: String,
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters'],
    default: 'Career Chat Session'
  },
  
  // Chat Context
  context: {
    topic: {
      type: String,
      enum: ['career-planning', 'skills-assessment', 'pivot-planning', 'resume-review', 'interview-prep', 'networking', 'general', 'other'],
      default: 'general'
    },
    subtopic: {
      type: String,
      trim: true,
      maxlength: [50, 'Subtopic cannot exceed 50 characters'],
      default: ''
    },
    userGoal: {
      type: String,
      maxlength: [300, 'User goal cannot exceed 300 characters'],
      default: ''
    },
    userContext: {
      currentRole: String,
      targetRole: String,
      experience: String,
      industry: String
    }
  },
  
  // Messages
  messages: [{
    role: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: [10000, 'Message content cannot exceed 10000 characters']
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    messageType: {
      type: String,
      enum: ['text', 'question', 'answer', 'suggestion', 'clarification', 'action-item', 'other'],
      default: 'text'
    },
    metadata: {
      tokens: Number,
      model: String,
      confidence: Number,
      intent: String,
      entities: [{
        type: String,
        value: String,
        confidence: Number
      }]
    },
    attachments: [{
      type: {
        type: String,
        enum: ['file', 'image', 'link', 'document'],
        default: 'file'
      },
      name: String,
      url: String,
      size: Number,
      mimeType: String
    }],
    reactions: {
      helpful: { type: Boolean, default: null },
      followUp: { type: Boolean, default: null },
      clarification: { type: Boolean, default: null }
    }
  }],
  
  // Session Status
  status: {
    type: String,
    enum: ['active', 'paused', 'completed', 'archived'],
    default: 'active'
  },
  
  // Session Analytics
  analytics: {
    totalMessages: {
      type: Number,
      default: 0
    },
    userMessages: {
      type: Number,
      default: 0
    },
    assistantMessages: {
      type: Number,
      default: 0
    },
    sessionDuration: {
      type: Number, // in minutes
      default: 0
    },
    averageResponseTime: {
      type: Number, // in seconds
      default: 0
    },
    userSatisfaction: {
      type: Number,
      min: [1, 'Satisfaction must be at least 1'],
      max: [5, 'Satisfaction cannot exceed 5'],
      default: null
    },
    topicsDiscussed: [{
      topic: String,
      messageCount: Number,
      timeSpent: Number // in minutes
    }],
    actionItems: [{
      item: String,
      priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
      },
      isCompleted: {
        type: Boolean,
        default: false
      },
      dueDate: Date,
      completedDate: Date
    }],
    insights: [{
      type: {
        type: String,
        enum: ['skill-gap', 'opportunity', 'challenge', 'recommendation', 'trend', 'other'],
        default: 'other'
      },
      insight: String,
      confidence: Number,
      source: String
    }]
  },
  
  // AI Model Information
  aiModel: {
    name: {
      type: String,
      trim: true,
      maxlength: [50, 'Model name cannot exceed 50 characters'],
      default: 'gpt-4'
    },
    version: {
      type: String,
      trim: true,
      maxlength: [20, 'Version cannot exceed 20 characters'],
      default: '1.0'
    },
    parameters: {
      temperature: {
        type: Number,
        min: [0, 'Temperature cannot be negative'],
        max: [2, 'Temperature cannot exceed 2'],
        default: 0.7
      },
      maxTokens: {
        type: Number,
        min: [1, 'Max tokens must be at least 1'],
        default: 1000
      }
    }
  },
  
  // Session Metadata
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date,
    default: null
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  
  // User Feedback
  feedback: {
    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
      default: null
    },
    comment: {
      type: String,
      maxlength: [500, 'Feedback comment cannot exceed 500 characters'],
      default: ''
    },
    helpful: {
      type: Boolean,
      default: null
    },
    wouldRecommend: {
      type: Boolean,
      default: null
    },
    submittedAt: {
      type: Date,
      default: null
    }
  },
  
  // Privacy and Security
  isPrivate: {
    type: Boolean,
    default: true
  },
  retentionPeriod: {
    type: Number, // in days
    default: 365
  },
  
  // Tags for organization
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
aiChatLogSchema.index({ user: 1, status: 1 });
aiChatLogSchema.index({ user: 1, startTime: -1 });
aiChatLogSchema.index({ sessionId: 1 });
aiChatLogSchema.index({ 'context.topic': 1, status: 1 });
aiChatLogSchema.index({ lastActivity: 1 });

// Virtual for session duration
aiChatLogSchema.virtual('duration').get(function() {
  if (!this.startTime) return 0;
  const end = this.endTime || new Date();
  const duration = end - this.startTime;
  return Math.round(duration / (1000 * 60)); // Convert to minutes
});

// Virtual for message count
aiChatLogSchema.virtual('messageCount').get(function() {
  return this.messages ? this.messages.length : 0;
});

// Method to add message
aiChatLogSchema.methods.addMessage = function(messageData) {
  this.messages.push(messageData);
  this.lastActivity = new Date();
  this.analytics.totalMessages = this.messages.length;
  
  // Update message counts
  this.analytics.userMessages = this.messages.filter(m => m.role === 'user').length;
  this.analytics.assistantMessages = this.messages.filter(m => m.role === 'assistant').length;
  
  return this.save();
};

// Method to end session
aiChatLogSchema.methods.endSession = function() {
  this.status = 'completed';
  this.endTime = new Date();
  this.analytics.sessionDuration = this.duration;
  return this.save();
};

// Method to add action item
aiChatLogSchema.methods.addActionItem = function(actionItem) {
  this.analytics.actionItems.push(actionItem);
  return this.save();
};

// Method to complete action item
aiChatLogSchema.methods.completeActionItem = function(actionItemIndex) {
  if (this.analytics.actionItems[actionItemIndex]) {
    this.analytics.actionItems[actionItemIndex].isCompleted = true;
    this.analytics.actionItems[actionItemIndex].completedDate = new Date();
  }
  return this.save();
};

// Method to add insight
aiChatLogSchema.methods.addInsight = function(insightData) {
  this.analytics.insights.push(insightData);
  return this.save();
};

// Method to submit feedback
aiChatLogSchema.methods.submitFeedback = function(feedbackData) {
  this.feedback = {
    ...this.feedback,
    ...feedbackData,
    submittedAt: new Date()
  };
  this.analytics.userSatisfaction = feedbackData.rating;
  return this.save();
};

// Method to get conversation summary
aiChatLogSchema.methods.getSummary = function() {
  const userMessages = this.messages.filter(m => m.role === 'user');
  const assistantMessages = this.messages.filter(m => m.role === 'assistant');
  
  return {
    sessionId: this.sessionId,
    title: this.title,
    topic: this.context.topic,
    duration: this.duration,
    totalMessages: this.messages.length,
    userMessages: userMessages.length,
    assistantMessages: assistantMessages.length,
    startTime: this.startTime,
    endTime: this.endTime,
    status: this.status,
    satisfaction: this.feedback.rating,
    actionItems: this.analytics.actionItems.filter(item => !item.isCompleted).length
  };
};

// Pre-save middleware to update analytics
aiChatLogSchema.pre('save', function(next) {
  if (this.isModified('messages')) {
    this.analytics.totalMessages = this.messages.length;
    this.analytics.userMessages = this.messages.filter(m => m.role === 'user').length;
    this.analytics.assistantMessages = this.messages.filter(m => m.role === 'assistant').length;
  }
  next();
});

module.exports = mongoose.model('AIChatLog', aiChatLogSchema); 