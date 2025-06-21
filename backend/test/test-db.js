const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Test database connection
const testConnection = async () => {
  try {
    console.log('🔌 Testing MongoDB connection...');
    console.log('📡 Connecting to:', process.env.MONGO_URI ? 'MongoDB Atlas' : 'No MONGO_URI found');
    
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not set');
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB Connected Successfully!');
    console.log('📍 Host:', conn.connection.host);
    console.log('🗄️  Database:', conn.connection.name);
    console.log('🔗 Connection State:', conn.connection.readyState === 1 ? 'Connected' : 'Disconnected');

    // Test a simple operation
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('📚 Collections in database:', collections.length);

    // Close the connection
    await mongoose.connection.close();
    console.log('🔌 Connection closed successfully');
    process.exit(0);

  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('Error:', error.message);
    process.exit(1);
  }
};

// Run the test
testConnection(); 