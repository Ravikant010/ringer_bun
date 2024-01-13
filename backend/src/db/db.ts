const mongoose = require('mongoose');

// Define the MongoDB connection string
const mongoURI = 'mongodb://127.0.0.1:27017/ringer';

// Create a function for connecting to the database
async function connectToMongoDB() {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Add other options as needed (e.g., user and password)
    });
    console.log('🦍 Connected to MongoDB');

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

export default connectToMongoDB;
