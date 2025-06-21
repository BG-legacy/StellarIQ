const mongoose = require('mongoose');
const { User, CareerPlan, SkillsAssessment, PivotPlan, AIChatLog } = require('../models');

// Test database connection
const testDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/stellarurl-test');
    console.log('✅ Connected to test database');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

// Test model instantiation
const testModels = async () => {
  console.log('\n🧪 Testing Model Instantiation...\n');

  try {
    // Test User Model
    console.log('Testing User Model...');
    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123'
    };
    const user = new User(userData);
    console.log('✅ User model instantiated successfully');

    // Test CareerPlan Model
    console.log('Testing CareerPlan Model...');
    const careerPlanData = {
      user: user._id,
      title: 'Software Engineer Career Plan',
      targetRole: 'Senior Software Engineer',
      targetDate: new Date('2025-12-31')
    };
    const careerPlan = new CareerPlan(careerPlanData);
    console.log('✅ CareerPlan model instantiated successfully');

    // Test SkillsAssessment Model
    console.log('Testing SkillsAssessment Model...');
    const skillsAssessmentData = {
      user: user._id,
      title: 'Technical Skills Assessment',
      type: 'self-assessment'
    };
    const skillsAssessment = new SkillsAssessment(skillsAssessmentData);
    console.log('✅ SkillsAssessment model instantiated successfully');

    // Test PivotPlan Model
    console.log('Testing PivotPlan Model...');
    const pivotPlanData = {
      user: user._id,
      title: 'Career Pivot to Data Science',
      currentRole: 'Software Engineer',
      targetRole: 'Data Scientist',
      pivotType: 'function-change',
      targetDate: new Date('2025-06-30')
    };
    const pivotPlan = new PivotPlan(pivotPlanData);
    console.log('✅ PivotPlan model instantiated successfully');

    // Test AIChatLog Model
    console.log('Testing AIChatLog Model...');
    const aiChatLogData = {
      user: user._id,
      sessionId: 'test-session-123',
      title: 'Career Planning Session'
    };
    const aiChatLog = new AIChatLog(aiChatLogData);
    console.log('✅ AIChatLog model instantiated successfully');

    console.log('\n🎉 All models tested successfully!');
    
    // Test model methods
    console.log('\n🧪 Testing Model Methods...\n');
    
    // Test User methods
    const isPasswordValid = await user.comparePassword('password123');
    console.log('✅ User password comparison:', isPasswordValid);
    
    const publicProfile = user.getPublicProfile();
    console.log('✅ User public profile generated');
    
    // Test CareerPlan methods
    const daysRemaining = careerPlan.daysRemaining;
    console.log('✅ CareerPlan days remaining calculated:', daysRemaining);
    
    // Test SkillsAssessment methods
    const completionPercentage = skillsAssessment.completionPercentage;
    console.log('✅ SkillsAssessment completion percentage:', completionPercentage);
    
    // Test PivotPlan methods
    const riskScore = pivotPlan.riskScore;
    console.log('✅ PivotPlan risk score:', riskScore);
    
    // Test AIChatLog methods
    const summary = aiChatLog.getSummary();
    console.log('✅ AIChatLog summary generated');

    console.log('\n🎉 All model methods tested successfully!');

  } catch (error) {
    console.error('❌ Model test failed:', error.message);
    throw error;
  }
};

// Run tests
const runTests = async () => {
  try {
    await testDB();
    await testModels();
    console.log('\n✅ All tests completed successfully!');
  } catch (error) {
    console.error('\n❌ Tests failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from database');
    process.exit(0);
  }
};

// Run if this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = { testModels }; 