const mongoose = require('mongoose');

const pivotPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Pivot Information
  title: {
    type: String,
    required: [true, 'Pivot plan title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
    default: ''
  },
  
  // Current Situation
  currentRole: {
    type: String,
    required: [true, 'Current role is required'],
    trim: true,
    maxlength: [100, 'Current role cannot exceed 100 characters']
  },
  currentIndustry: {
    type: String,
    trim: true,
    maxlength: [100, 'Current industry cannot exceed 100 characters'],
    default: ''
  },
  currentCompany: {
    type: String,
    trim: true,
    maxlength: [100, 'Current company cannot exceed 100 characters'],
    default: ''
  },
  
  // Target Situation
  targetRole: {
    type: String,
    required: [true, 'Target role is required'],
    trim: true,
    maxlength: [100, 'Target role cannot exceed 100 characters']
  },
  targetIndustry: {
    type: String,
    trim: true,
    maxlength: [100, 'Target industry cannot exceed 100 characters'],
    default: ''
  },
  targetCompany: {
    type: String,
    trim: true,
    maxlength: [100, 'Target company cannot exceed 100 characters'],
    default: ''
  },
  
  // Pivot Type
  pivotType: {
    type: String,
    enum: ['role-change', 'industry-change', 'function-change', 'level-change', 'entrepreneurship', 'geographic', 'hybrid'],
    required: [true, 'Pivot type is required']
  },
  
  // Motivation and Reasons
  motivation: {
    primary: {
      type: String,
      required: [true, 'Primary motivation is required'],
      enum: ['career-growth', 'work-life-balance', 'salary-increase', 'passion', 'stability', 'challenge', 'location', 'other'],
      default: 'career-growth'
    },
    secondary: [{
      type: String,
      enum: ['career-growth', 'work-life-balance', 'salary-increase', 'passion', 'stability', 'challenge', 'location', 'other']
    }],
    description: {
      type: String,
      maxlength: [500, 'Motivation description cannot exceed 500 characters'],
      default: ''
    }
  },
  
  // Timeline
  targetDate: {
    type: Date,
    required: [true, 'Target date is required']
  },
  estimatedDuration: {
    type: Number, // in months
    min: [1, 'Duration must be at least 1 month'],
    default: 6
  },
  
  // Status and Progress
  status: {
    type: String,
    enum: ['planning', 'preparation', 'execution', 'transition', 'completed', 'paused', 'abandoned'],
    default: 'planning'
  },
  progress: {
    type: Number,
    min: [0, 'Progress cannot be negative'],
    max: [100, 'Progress cannot exceed 100%'],
    default: 0
  },
  
  // Skills Analysis
  skillsAnalysis: {
    transferableSkills: [{
      skill: {
        type: String,
        trim: true,
        maxlength: [50, 'Skill name cannot exceed 50 characters']
      },
      currentLevel: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'expert'],
        default: 'beginner'
      },
      relevanceToTarget: {
        type: String,
        enum: ['high', 'medium', 'low', 'not-applicable'],
        default: 'medium'
      },
      notes: {
        type: String,
        maxlength: [200, 'Notes cannot exceed 200 characters'],
        default: ''
      }
    }],
    skillsToDevelop: [{
      skill: {
        type: String,
        trim: true,
        maxlength: [50, 'Skill name cannot exceed 50 characters']
      },
      priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
      },
      currentLevel: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'expert'],
        default: 'beginner'
      },
      targetLevel: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'expert'],
        default: 'intermediate'
      },
      timeline: {
        type: Number, // in months
        min: [1, 'Timeline must be at least 1 month'],
        default: 3
      },
      resources: [{
        title: String,
        url: String,
        type: {
          type: String,
          enum: ['course', 'book', 'article', 'video', 'mentor', 'project', 'other'],
          default: 'other'
        }
      }],
      isCompleted: {
        type: Boolean,
        default: false
      }
    }],
    skillsToAcquire: [{
      skill: {
        type: String,
        trim: true,
        maxlength: [50, 'Skill name cannot exceed 50 characters']
      },
      priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
      },
      timeline: {
        type: Number, // in months
        min: [1, 'Timeline must be at least 1 month'],
        default: 3
      },
      resources: [{
        title: String,
        url: String,
        type: {
          type: String,
          enum: ['course', 'book', 'article', 'video', 'mentor', 'project', 'other'],
          default: 'other'
        }
      }],
      isCompleted: {
        type: Boolean,
        default: false
      }
    }]
  },
  
  // Action Plan
  actionPlan: {
    phases: [{
      name: {
        type: String,
        required: true,
        trim: true,
        maxlength: [50, 'Phase name cannot exceed 50 characters']
      },
      description: {
        type: String,
        maxlength: [300, 'Phase description cannot exceed 300 characters'],
        default: ''
      },
      duration: {
        type: Number, // in months
        min: [1, 'Duration must be at least 1 month'],
        default: 1
      },
      startDate: Date,
      endDate: Date,
      isCompleted: {
        type: Boolean,
        default: false
      },
      tasks: [{
        title: {
          type: String,
          required: true,
          trim: true,
          maxlength: [100, 'Task title cannot exceed 100 characters']
        },
        description: {
          type: String,
          maxlength: [300, 'Task description cannot exceed 300 characters'],
          default: ''
        },
        dueDate: Date,
        priority: {
          type: String,
          enum: ['low', 'medium', 'high', 'critical'],
          default: 'medium'
        },
        isCompleted: {
          type: Boolean,
          default: false
        },
        completedDate: Date
      }]
    }]
  },
  
  // Risk Assessment
  risks: [{
    risk: {
      type: String,
      required: true,
      trim: true,
      maxlength: [100, 'Risk description cannot exceed 100 characters']
    },
    probability: {
      type: String,
      enum: ['low', 'medium', 'high', 'very-high'],
      default: 'medium'
    },
    impact: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    mitigation: {
      type: String,
      maxlength: [300, 'Mitigation strategy cannot exceed 300 characters'],
      default: ''
    }
  }],
  
  // Financial Planning
  financialPlanning: {
    currentSalary: {
      type: Number,
      min: [0, 'Current salary cannot be negative'],
      default: null
    },
    targetSalary: {
      type: Number,
      min: [0, 'Target salary cannot be negative'],
      default: null
    },
    transitionCosts: {
      type: Number,
      min: [0, 'Transition costs cannot be negative'],
      default: 0
    },
    savingsRequired: {
      type: Number,
      min: [0, 'Savings required cannot be negative'],
      default: 0
    },
    timelineToSavings: {
      type: Number, // in months
      min: [0, 'Timeline cannot be negative'],
      default: 0
    }
  },
  
  // Network and Support
  network: {
    mentors: [{
      name: String,
      role: String,
      company: String,
      contactInfo: String,
      relationship: {
        type: String,
        enum: ['professional', 'personal', 'alumni', 'other'],
        default: 'professional'
      }
    }],
    targetConnections: [{
      name: String,
      role: String,
      company: String,
      howToConnect: String,
      priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
      }
    }],
    supportSystem: [{
      name: String,
      relationship: String,
      supportType: {
        type: String,
        enum: ['emotional', 'financial', 'professional', 'logistical', 'other'],
        default: 'emotional'
      }
    }]
  },
  
  // Notes and Reflections
  notes: {
    type: String,
    maxlength: [2000, 'Notes cannot exceed 2000 characters'],
    default: ''
  },
  
  // Tags for organization
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  
  // Visibility
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for better query performance
pivotPlanSchema.index({ user: 1, status: 1 });
pivotPlanSchema.index({ user: 1, targetDate: 1 });
pivotPlanSchema.index({ pivotType: 1, status: 1 });

// Virtual for days remaining
pivotPlanSchema.virtual('daysRemaining').get(function() {
  if (!this.targetDate) return null;
  const now = new Date();
  const target = new Date(this.targetDate);
  const diffTime = target - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Virtual for risk score
pivotPlanSchema.virtual('riskScore').get(function() {
  if (!this.risks || this.risks.length === 0) return 0;
  
  const riskValues = { low: 1, medium: 2, high: 3, 'very-high': 4 };
  const impactValues = { low: 1, medium: 2, high: 3, critical: 4 };
  
  let totalScore = 0;
  this.risks.forEach(risk => {
    totalScore += riskValues[risk.probability] * impactValues[risk.impact];
  });
  
  return Math.round(totalScore / this.risks.length);
});

// Method to update progress based on completed tasks
pivotPlanSchema.methods.updateProgress = function() {
  let totalTasks = 0;
  let completedTasks = 0;
  
  this.actionPlan.phases.forEach(phase => {
    phase.tasks.forEach(task => {
      totalTasks++;
      if (task.isCompleted) completedTasks++;
    });
  });
  
  this.progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  return this.save();
};

// Method to add phase
pivotPlanSchema.methods.addPhase = function(phaseData) {
  this.actionPlan.phases.push(phaseData);
  return this.save();
};

// Method to complete task
pivotPlanSchema.methods.completeTask = function(phaseIndex, taskIndex) {
  if (this.actionPlan.phases[phaseIndex] && this.actionPlan.phases[phaseIndex].tasks[taskIndex]) {
    this.actionPlan.phases[phaseIndex].tasks[taskIndex].isCompleted = true;
    this.actionPlan.phases[phaseIndex].tasks[taskIndex].completedDate = new Date();
    this.updateProgress();
  }
  return this.save();
};

// Method to add risk
pivotPlanSchema.methods.addRisk = function(riskData) {
  this.risks.push(riskData);
  return this.save();
};

module.exports = mongoose.model('PivotPlan', pivotPlanSchema); 