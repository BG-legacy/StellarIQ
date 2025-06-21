const request = require('axios');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const testServer = async () => {
  try {
    console.log('🚀 Testing server connection...');
    
    const PORT = process.env.PORT || 5000;
    const baseURL = `http://localhost:${PORT}`;
    
    console.log('📡 Attempting to connect to:', baseURL);
    
    // Test the root endpoint
    const response = await request.get(baseURL, {
      timeout: 5000 // 5 second timeout
    });
    
    console.log('✅ Server is running!');
    console.log('📊 Status Code:', response.status);
    console.log('📄 Response:', response.data);
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ Server is not running. Please start the server first with:');
      console.error('   npm start');
    } else {
      console.error('❌ Server test failed:', error.message);
    }
  }
};

// Run the test
testServer(); 