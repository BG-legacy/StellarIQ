const request = require('axios');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

// Load environment variables
dotenv.config();

const testAuth = async () => {
  console.log('🔐 Testing Authentication System...\n');
  
  const PORT = process.env.PORT || 5000;
  const baseURL = `http://localhost:${PORT}/api/auth`;
  
  let authToken = null;
  let testUserId = null;
  
  try {
    // Test 1: Health Check
    console.log('='.repeat(60));
    console.log('TEST 1: Auth Health Check');
    console.log('='.repeat(60));
    
    const healthResponse = await request.get(`${baseURL}/health`);
    console.log('✅ Auth health check passed');
    console.log('📊 Status:', healthResponse.status);
    console.log('📄 Response:', healthResponse.data);
    
    // Test 2: Registration
    console.log('\n' + '='.repeat(60));
    console.log('TEST 2: User Registration');
    console.log('='.repeat(60));
    
    const testUser = {
      firstName: 'Test',
      lastName: 'User',
      email: `test.user.${Date.now()}@example.com`,
      password: 'TestPassword123!'
    };
    
    const registerResponse = await request.post(`${baseURL}/register`, testUser);
    console.log('✅ User registration successful');
    console.log('📊 Status:', registerResponse.status);
    console.log('📄 Response:', {
      success: registerResponse.data.success,
      message: registerResponse.data.message,
      hasToken: !!registerResponse.data.data?.token,
      hasUser: !!registerResponse.data.data?.user
    });
    
    authToken = registerResponse.data.data.token;
    testUserId = registerResponse.data.data.user._id;
    
    // Test 3: Duplicate Registration (should fail)
    console.log('\n' + '='.repeat(60));
    console.log('TEST 3: Duplicate Registration (Expected to Fail)');
    console.log('='.repeat(60));
    
    try {
      await request.post(`${baseURL}/register`, testUser);
      console.log('❌ Duplicate registration should have failed');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✅ Duplicate registration correctly rejected');
        console.log('📊 Status:', error.response.status);
        console.log('📄 Error:', error.response.data.message);
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }
    
    // Test 4: Login
    console.log('\n' + '='.repeat(60));
    console.log('TEST 4: User Login');
    console.log('='.repeat(60));
    
    const loginData = {
      email: testUser.email,
      password: testUser.password
    };
    
    const loginResponse = await request.post(`${baseURL}/login`, loginData);
    console.log('✅ User login successful');
    console.log('📊 Status:', loginResponse.status);
    console.log('📄 Response:', {
      success: loginResponse.data.success,
      message: loginResponse.data.message,
      hasToken: !!loginResponse.data.data?.token,
      hasUser: !!loginResponse.data.data?.user
    });
    
    // Update auth token from login
    authToken = loginResponse.data.data.token;
    
    // Test 5: Invalid Login (wrong password)
    console.log('\n' + '='.repeat(60));
    console.log('TEST 5: Invalid Login (Wrong Password)');
    console.log('='.repeat(60));
    
    try {
      await request.post(`${baseURL}/login`, {
        email: testUser.email,
        password: 'WrongPassword123!'
      });
      console.log('❌ Invalid login should have failed');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ Invalid login correctly rejected');
        console.log('📊 Status:', error.response.status);
        console.log('📄 Error:', error.response.data.message);
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }
    
    // Test 6: Get Profile (Protected Route)
    console.log('\n' + '='.repeat(60));
    console.log('TEST 6: Get Profile (Protected Route)');
    console.log('='.repeat(60));
    
    const profileResponse = await request.get(`${baseURL}/profile`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    console.log('✅ Profile retrieval successful');
    console.log('📊 Status:', profileResponse.status);
    console.log('📄 Response:', {
      success: profileResponse.data.success,
      hasUser: !!profileResponse.data.data?.user,
      userEmail: profileResponse.data.data?.user?.email
    });
    
    // Test 7: Get Profile Without Token (should fail)
    console.log('\n' + '='.repeat(60));
    console.log('TEST 7: Get Profile Without Token (Expected to Fail)');
    console.log('='.repeat(60));
    
    try {
      await request.get(`${baseURL}/profile`);
      console.log('❌ Profile access without token should have failed');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ Profile access without token correctly rejected');
        console.log('📊 Status:', error.response.status);
        console.log('📄 Error:', error.response.data.message);
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }
    
    // Test 8: Update Profile
    console.log('\n' + '='.repeat(60));
    console.log('TEST 8: Update Profile');
    console.log('='.repeat(60));
    
    const updateData = {
      bio: 'Updated bio for testing',
      location: 'Test City, Test State',
      currentRole: 'Software Engineer',
      currentCompany: 'Test Company'
    };
    
    const updateResponse = await request.put(`${baseURL}/profile`, updateData, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    console.log('✅ Profile update successful');
    console.log('📊 Status:', updateResponse.status);
    console.log('📄 Response:', {
      success: updateResponse.data.success,
      message: updateResponse.data.message,
      updatedBio: updateResponse.data.data?.user?.bio
    });
    
    // Test 9: Change Password
    console.log('\n' + '='.repeat(60));
    console.log('TEST 9: Change Password');
    console.log('='.repeat(60));
    
    const passwordData = {
      currentPassword: testUser.password,
      newPassword: 'NewTestPassword123!'
    };
    
    const passwordResponse = await request.put(`${baseURL}/change-password`, passwordData, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    console.log('✅ Password change successful');
    console.log('📊 Status:', passwordResponse.status);
    console.log('📄 Response:', {
      success: passwordResponse.data.success,
      message: passwordResponse.data.message
    });
    
    // Test 10: Login with New Password
    console.log('\n' + '='.repeat(60));
    console.log('TEST 10: Login with New Password');
    console.log('='.repeat(60));
    
    const newLoginData = {
      email: testUser.email,
      password: passwordData.newPassword
    };
    
    const newLoginResponse = await request.post(`${baseURL}/login`, newLoginData);
    console.log('✅ Login with new password successful');
    console.log('📊 Status:', newLoginResponse.status);
    console.log('📄 Response:', {
      success: newLoginResponse.data.success,
      message: newLoginResponse.data.message,
      hasToken: !!newLoginResponse.data.data?.token
    });
    
    // Test 11: Logout
    console.log('\n' + '='.repeat(60));
    console.log('TEST 11: Logout');
    console.log('='.repeat(60));
    
    const logoutResponse = await request.post(`${baseURL}/logout`, {}, {
      headers: {
        'Authorization': `Bearer ${newLoginResponse.data.data.token}`
      }
    });
    console.log('✅ Logout successful');
    console.log('📊 Status:', logoutResponse.status);
    console.log('📄 Response:', {
      success: logoutResponse.data.success,
      message: logoutResponse.data.message
    });
    
    // Test 12: Registration Validation
    console.log('\n' + '='.repeat(60));
    console.log('TEST 12: Registration Validation');
    console.log('='.repeat(60));
    
    // Test missing fields
    try {
      await request.post(`${baseURL}/register`, {
        firstName: 'Test',
        // Missing lastName, email, password
      });
      console.log('❌ Registration with missing fields should have failed');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✅ Registration validation working correctly');
        console.log('📊 Status:', error.response.status);
        console.log('📄 Error:', error.response.data.message);
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }
    
    // Test invalid email
    try {
      await request.post(`${baseURL}/register`, {
        firstName: 'Test',
        lastName: 'User',
        email: 'invalid-email',
        password: 'password123'
      });
      console.log('❌ Registration with invalid email should have failed');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✅ Email validation working correctly');
        console.log('📊 Status:', error.response.status);
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('🎉 All Authentication Tests Completed Successfully!');
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('\n❌ Authentication test failed:', error.message);
    if (error.response) {
      console.error('📊 Status:', error.response.status);
      console.error('📄 Response:', error.response.data);
    }
  } finally {
    // Cleanup: Delete test user from database
    if (testUserId) {
      try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/stellarurl-test');
        await User.findByIdAndDelete(testUserId);
        console.log('🧹 Test user cleaned up from database');
        await mongoose.disconnect();
      } catch (cleanupError) {
        console.error('⚠️  Cleanup failed:', cleanupError.message);
      }
    }
  }
};

// Run if this file is executed directly
if (require.main === module) {
  testAuth();
}

module.exports = { testAuth }; 