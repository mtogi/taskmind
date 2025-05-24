const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');

const createDemoUser = async () => {
  try {
    console.log('🌱 Creating demo user...');

    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/taskmind';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Check if demo user already exists
    const existingUser = await User.findByEmail('demo@taskmind.com');
    if (existingUser) {
      console.log('ℹ️  Demo user already exists');
      return;
    }

    // Create demo user
    const demoUser = new User({
      name: 'Demo User',
      email: 'demo@taskmind.com',
      password: 'Demo123!',
      preferences: {
        theme: 'light',
        emailNotifications: true,
        taskReminders: true
      },
      isEmailVerified: true
    });

    await demoUser.save();
    console.log('✅ Demo user created successfully!');
    console.log('📧 Email: demo@taskmind.com');
    console.log('🔑 Password: Demo123!');

  } catch (error) {
    console.error('❌ Error creating demo user:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run the function
createDemoUser(); 