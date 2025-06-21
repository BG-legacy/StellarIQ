const { exec } = require('child_process');
const path = require('path');

console.log('🧪 Running StellarIQ Backend Tests...\n');

// Test 1: Database Connection
console.log('='.repeat(50));
console.log('TEST 1: Database Connection');
console.log('='.repeat(50));

exec('node test/test-db.js', (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Database test failed:', error.message);
    return;
  }
  console.log(stdout);
  
  // Test 2: Server Connection (only if database test passes)
  console.log('\n' + '='.repeat(50));
  console.log('TEST 2: Server Connection');
  console.log('='.repeat(50));
  console.log('⚠️  Note: Make sure to start the server first with "npm start"');
  
  exec('node test/test-server.js', (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Server test failed:', error.message);
      return;
    }
    console.log(stdout);
    
    // Test 3: Model Tests (only if server test passes)
    console.log('\n' + '='.repeat(50));
    console.log('TEST 3: Model Tests');
    console.log('='.repeat(50));
    
    exec('node test/test-models.js', (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Model test failed:', error.message);
        return;
      }
      console.log(stdout);
      
      // Test 4: Authentication Tests (only if all previous tests pass)
      console.log('\n' + '='.repeat(50));
      console.log('TEST 4: Authentication Tests');
      console.log('='.repeat(50));
      console.log('⚠️  Note: Server must be running for auth tests');
      
      exec('node test/test-auth.js', (error, stdout, stderr) => {
        if (error) {
          console.error('❌ Authentication test failed:', error.message);
          return;
        }
        console.log(stdout);
        
        console.log('\n' + '='.repeat(50));
        console.log('🎉 All tests completed!');
        console.log('='.repeat(50));
      });
    });
  });
}); 