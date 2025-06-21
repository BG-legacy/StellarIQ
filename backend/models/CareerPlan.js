const mongoose = require('mongoose');

const careerPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Career Goals
  title: {
    type: String,
    required: [true, 'Career plan title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
    default: ''
  },
  
  // Target Career Information
  targetRole: {
    type: String,
    required: [true, 'Target role is required'],
    trim: true,
    maxlength: [100, 'Target role cannot exceed 100 characters']
  },
  targetCompany: {
    type: String,
    trim: true,
    maxlength: [100, 'Target company cannot exceed 100 characters'],
    default: ''
  },
  targetIndustry: {
    type: String,
    trim: true,
    maxlength: [100, 'Target industry cannot exceed 100 characters'],
    default: ''
  },
  targetSalary: {
    type: Number,
    min: [0, 'Target salary cannot be negative'],
    default: null
  },
  
  // Timeline
  targetDate: {
    type: Date,
    required: [true, 'Target date is required']
  },
  estimatedDuration: {
    type: Number, // in months
    min: [1, 'Duration must be at least 1 month'],
    default: 12
  },
  
  // Current Status
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'completed', 'abandoned'],
    default: 'draft'
  },
  progress: {
    type: Number,
    min: [0, 'Progress cannot be negative'],
    max: [100, 'Progress cannot exceed 100%'],
    default: 0
  },
  
  // Skills and Requirements
  requiredSkills: [{
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
    isAcquired: {
      type: Boolean,
      default: false
    },
    targetDate: Date
  }],
  
  // Milestones
  milestones: [{
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: [100, 'Milestone title cannot exceed 100 characters']
    },
    description: {
      type: String,
      maxlength: [500, 'Milestone description cannot exceed 500 characters'],
      default: ''
    },
    dueDate: {
      type: Date,
      required: true
    },
    isCompleted: {
      type: Boolean,
      default: false
    },
    completedDate: {
      type: Date,
      default: null
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    }
  }],
  
  // Resources and Notes
  resources: [{
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: [100, 'Resource title cannot exceed 100 characters']
    },
    url: {
      type: String,
      trim: true
    },
    type: {
      type: String,
      enum: ['course', 'book', 'article', 'video', 'podcast', 'other'],
      default: 'other'
    },
    isCompleted: {
      type: Boolean,
      default: false
    }
  }],
  
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
careerPlanSchema.index({ user: 1, status: 1 });
careerPlanSchema.index({ user: 1, targetDate: 1 });
careerPlanSchema.index({ status: 1, targetDate: 1 });

// Virtual for days remaining
careerPlanSchema.virtual('daysRemaining').get(function() {
  if (!this.targetDate) return null;
  const now = new Date();
  const target = new Date(this.targetDate);
  const diffTime = target - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Virtual for completion percentage based on milestones
careerPlanSchema.virtual('milestoneProgress').get(function() {
  if (!this.milestones || this.milestones.length === 0) return 0;
  const completed = this.milestones.filter(milestone => milestone.isCompleted).length;
  return Math.round((completed / this.milestones.length) * 100);
});

// Method to update progress based on milestones
careerPlanSchema.methods.updateProgress = function() {
  if (this.milestones && this.milestones.length > 0) {
    this.progress = this.milestoneProgress;
  }
  return this.save();
};

// Method to add milestone
careerPlanSchema.methods.addMilestone = function(milestoneData) {
  this.milestones.push(milestoneData);
  return this.save();
};

// Method to complete milestone
careerPlanSchema.methods.completeMilestone = function(milestoneId) {
  const milestone = this.milestones.id(milestoneId);
  if (milestone) {
    milestone.isCompleted = true;
    milestone.completedDate = new Date();
    this.updateProgress();
  }
  return this.save();
};

module.exports = mongoose.model('CareerPlan', careerPlanSchema); 