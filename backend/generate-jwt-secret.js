const crypto = require('crypto');

console.log('🔐 Generating JWT Secret Key...\n');

// Generate a secure random string for JWT secret
const jwtSecret = crypto.randomBytes(64).toString('hex');

console.log('✅ JWT Secret generated successfully!\n');
console.log('📋 Add this to your .env file:');
console.log('='.repeat(60));
console.log(`JWT_SECRET=${jwtSecret}`);
console.log('='.repeat(60));
console.log('\n⚠️  Important Security Notes:');
console.log('• Keep this secret secure and never commit it to version control');
console.log('• Use different secrets for development, staging, and production');
console.log('• The secret should be at least 32 characters long (this one is 128)');
console.log('• Store it securely in your environment variables');
console.log('\n🎯 Copy the JWT_SECRET line above and paste it into your .env file'); 