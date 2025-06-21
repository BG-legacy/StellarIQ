const mongoose = require('mongoose');

const skillsAssessmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Assessment Information
  title: {
    type: String,
    required: [true, 'Assessment title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: ''
  },
  
  // Assessment Type
  type: {
    type: String,
    enum: ['self-assessment', 'quiz', 'test', 'peer-review', 'certification', 'other'],
    default: 'self-assessment'
  },
  
  // Assessment Status
  status: {
    type: String,
    enum: ['draft', 'in-progress', 'completed', 'archived'],
    default: 'draft'
  },
  
  // Skills Categories
  categories: [{
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: [50, 'Category name cannot exceed 50 characters']
    },
    description: {
      type: String,
      maxlength: [200, 'Category description cannot exceed 200 characters'],
      default: ''
    },
    skills: [{
      name: {
        type: String,
        required: true,
        trim: true,
        maxlength: [50, 'Skill name cannot exceed 50 characters']
      },
      description: {
        type: String,
        maxlength: [200, 'Skill description cannot exceed 200 characters'],
        default: ''
      },
      proficiencyLevel: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'expert'],
        default: 'beginner'
      },
      selfRating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [10, 'Rating cannot exceed 10'],
        default: 1
      },
      confidenceLevel: {
        type: Number,
        min: [1, 'Confidence must be at least 1'],
        max: [10, 'Confidence cannot exceed 10'],
        default: 1
      },
      yearsOfExperience: {
        type: Number,
        min: [0, 'Years of experience cannot be negative'],
        default: 0
      },
      isRelevant: {
        type: Boolean,
        default: true
      },
      notes: {
        type: String,
        maxlength: [500, 'Notes cannot exceed 500 characters'],
        default: ''
      }
    }]
  }],
  
  // Assessment Results
  results: {
    totalSkills: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      min: [0, 'Average rating cannot be negative'],
      max: [10, 'Average rating cannot exceed 10'],
      default: 0
    },
    averageConfidence: {
      type: Number,
      min: [0, 'Average confidence cannot be negative'],
      max: [10, 'Average confidence cannot exceed 10'],
      default: 0
    },
    skillsByLevel: {
      beginner: { type: Number, default: 0 },
      intermediate: { type: Number, default: 0 },
      advanced: { type: Number, default: 0 },
      expert: { type: Number, default: 0 }
    },
    topSkills: [{
      skill: String,
      rating: Number,
      confidence: Number
    }],
    improvementAreas: [{
      skill: String,
      currentRating: Number,
      targetRating: Number,
      priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
      }
    }]
  },
  
  // Assessment Metadata
  duration: {
    type: Number, // in minutes
    min: [0, 'Duration cannot be negative'],
    default: 0
  },
  completedAt: {
    type: Date,
    default: null
  },
  
  // External Assessments
  externalAssessments: [{
    platform: {
      type: String,
      trim: true,
      maxlength: [50, 'Platform name cannot exceed 50 characters']
    },
    assessmentName: {
      type: String,
      trim: true,
      maxlength: [100, 'Assessment name cannot exceed 100 characters']
    },
    score: {
      type: Number,
      min: [0, 'Score cannot be negative']
    },
    maxScore: {
      type: Number,
      min: [1, 'Max score must be at least 1']
    },
    certificateUrl: String,
    completedDate: Date,
    validUntil: Date
  }],
  
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
  },
  
  // Version tracking
  version: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

// Indexes for better query performance
skillsAssessmentSchema.index({ user: 1, status: 1 });
skillsAssessmentSchema.index({ user: 1, completedAt: -1 });
skillsAssessmentSchema.index({ type: 1, status: 1 });

// Virtual for completion percentage
skillsAssessmentSchema.virtual('completionPercentage').get(function() {
  if (this.status === 'completed') return 100;
  if (this.status === 'draft') return 0;
  
  // Calculate based on categories and skills
  let totalSkills = 0;
  let ratedSkills = 0;
  
  this.categories.forEach(category => {
    category.skills.forEach(skill => {
      totalSkills++;
      if (skill.selfRating > 0) ratedSkills++;
    });
  });
  
  return totalSkills > 0 ? Math.round((ratedSkills / totalSkills) * 100) : 0;
});

// Method to calculate results
skillsAssessmentSchema.methods.calculateResults = function() {
  let totalSkills = 0;
  let totalRating = 0;
  let totalConfidence = 0;
  const skillsByLevel = { beginner: 0, intermediate: 0, advanced: 0, expert: 0 };
  const skillRatings = [];
  
  this.categories.forEach(category => {
    category.skills.forEach(skill => {
      totalSkills++;
      totalRating += skill.selfRating;
      totalConfidence += skill.confidenceLevel;
      skillsByLevel[skill.proficiencyLevel]++;
      
      skillRatings.push({
        skill: skill.name,
        rating: skill.selfRating,
        confidence: skill.confidenceLevel
      });
    });
  });
  
  // Calculate averages
  this.results.totalSkills = totalSkills;
  this.results.averageRating = totalSkills > 0 ? Math.round((totalRating / totalSkills) * 10) / 10 : 0;
  this.results.averageConfidence = totalSkills > 0 ? Math.round((totalConfidence / totalSkills) * 10) / 10 : 0;
  this.results.skillsByLevel = skillsByLevel;
  
  // Get top skills (top 5 by rating)
  this.results.topSkills = skillRatings
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);
  
  // Identify improvement areas (skills with rating < 7)
  this.results.improvementAreas = skillRatings
    .filter(skill => skill.rating < 7)
    .map(skill => ({
      skill: skill.skill,
      currentRating: skill.rating,
      targetRating: 8,
      priority: skill.rating < 4 ? 'critical' : skill.rating < 6 ? 'high' : 'medium'
    }))
    .sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    })
    .slice(0, 10);
  
  return this.save();
};

// Method to add skill to category
skillsAssessmentSchema.methods.addSkill = function(categoryName, skillData) {
  const category = this.categories.find(cat => cat.name === categoryName);
  if (category) {
    category.skills.push(skillData);
    this.calculateResults();
  }
  return this.save();
};

// Method to update skill rating
skillsAssessmentSchema.methods.updateSkillRating = function(categoryName, skillName, rating, confidence) {
  const category = this.categories.find(cat => cat.name === categoryName);
  if (category) {
    const skill = category.skills.find(s => s.name === skillName);
    if (skill) {
      skill.selfRating = rating;
      skill.confidenceLevel = confidence;
      this.calculateResults();
    }
  }
  return this.save();
};

module.exports = mongoose.model('SkillsAssessment', skillsAssessmentSchema); 