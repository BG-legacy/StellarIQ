const { testAuth } = require('./test-auth');

console.log('🔐 Running Authentication Tests Only...\n');
console.log('⚠️  Make sure the server is running with: npm start\n');

// Add a small delay to ensure server is ready
setTimeout(() => {
  testAuth().then(() => {
    console.log('\n✅ Authentication tests completed!');
    process.exit(0);
  }).catch((error) => {
    console.error('\n❌ Authentication tests failed:', error.message);
    process.exit(1);
  });
}, 2000); 