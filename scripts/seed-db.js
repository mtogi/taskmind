const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models (these will be created later)
// const User = require('../server/models/User');
// const Task = require('../server/models/Task');
// const Category = require('../server/models/Category');

// Sample data
const sampleUsers = [
  {
    email: 'demo@taskmind.com',
    password: 'Demo123!',
    firstName: 'Demo',
    lastName: 'User',
    preferences: {
      theme: 'light',
      notifications: true,
      aiSuggestions: true
    }
  },
  {
    email: 'john.doe@example.com',
    password: 'Password123!',
    firstName: 'John',
    lastName: 'Doe',
    preferences: {
      theme: 'dark',
      notifications: true,
      aiSuggestions: true
    }
  }
];

const sampleCategories = [
  { name: 'Work', color: '#3b82f6', icon: '💼', isDefault: true },
  { name: 'Personal', color: '#10b981', icon: '🏠', isDefault: true },
  { name: 'Health', color: '#f59e0b', icon: '🏥', isDefault: true },
  { name: 'Learning', color: '#8b5cf6', icon: '📚', isDefault: true },
  { name: 'Shopping', color: '#ef4444', icon: '🛒', isDefault: true },
  { name: 'Travel', color: '#06b6d4', icon: '✈️', isDefault: true }
];

const sampleTasks = [
  {
    title: 'Complete project proposal',
    description: 'Finish the Q2 project proposal for the new client',
    category: 'Work',
    priority: 4,
    status: 'pending',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    estimatedTime: 120,
    tags: ['urgent', 'client', 'proposal'],
    aiGenerated: false,
    aiScore: 0.85
  },
  {
    title: 'Schedule dentist appointment',
    description: 'Book annual dental checkup',
    category: 'Health',
    priority: 2,
    status: 'pending',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    estimatedTime: 30,
    tags: ['health', 'appointment'],
    aiGenerated: true,
    aiScore: 0.65
  },
  {
    title: 'Learn React Hooks',
    description: 'Complete the advanced React Hooks tutorial series',
    category: 'Learning',
    priority: 3,
    status: 'in-progress',
    dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
    estimatedTime: 300,
    tags: ['react', 'programming', 'tutorial'],
    aiGenerated: false,
    aiScore: 0.75,
    subtasks: [
      { title: 'Watch useState tutorial', completed: true, createdAt: new Date() },
      { title: 'Practice useEffect examples', completed: true, createdAt: new Date() },
      { title: 'Build custom hooks', completed: false, createdAt: new Date() },
      { title: 'Complete final project', completed: false, createdAt: new Date() }
    ]
  },
  {
    title: 'Buy groceries',
    description: 'Weekly grocery shopping for the family',
    category: 'Personal',
    priority: 2,
    status: 'pending',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    estimatedTime: 60,
    tags: ['shopping', 'family'],
    aiGenerated: true,
    aiScore: 0.55,
    subtasks: [
      { title: 'Check pantry inventory', completed: false, createdAt: new Date() },
      { title: 'Make shopping list', completed: false, createdAt: new Date() },
      { title: 'Visit grocery store', completed: false, createdAt: new Date() }
    ]
  },
  {
    title: 'Plan vacation to Japan',
    description: 'Research and plan summer vacation trip to Japan',
    category: 'Travel',
    priority: 3,
    status: 'pending',
    dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
    estimatedTime: 480,
    tags: ['vacation', 'japan', 'planning'],
    aiGenerated: false,
    aiScore: 0.70,
    subtasks: [
      { title: 'Research destinations', completed: false, createdAt: new Date() },
      { title: 'Book flights', completed: false, createdAt: new Date() },
      { title: 'Reserve hotels', completed: false, createdAt: new Date() },
      { title: 'Plan itinerary', completed: false, createdAt: new Date() },
      { title: 'Get travel insurance', completed: false, createdAt: new Date() }
    ]
  },
  {
    title: 'Prepare presentation slides',
    description: 'Create slides for the quarterly team meeting',
    category: 'Work',
    priority: 4,
    status: 'completed',
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    estimatedTime: 180,
    actualTime: 210,
    tags: ['presentation', 'meeting', 'quarterly'],
    aiGenerated: false,
    aiScore: 0.90,
    completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/taskmind';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Note: Uncomment these lines when the models are created
    /*
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Task.deleteMany({});
    await Category.deleteMany({});

    // Create users
    console.log('👥 Creating users...');
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      const savedUser = await user.save();
      createdUsers.push(savedUser);
      console.log(`✅ Created user: ${userData.email}`);
    }

    // Create categories for each user
    console.log('📂 Creating categories...');
    const createdCategories = [];
    for (const user of createdUsers) {
      for (const categoryData of sampleCategories) {
        const category = new Category({
          ...categoryData,
          userId: user._id
        });
        const savedCategory = await category.save();
        createdCategories.push(savedCategory);
      }
      console.log(`✅ Created categories for user: ${user.email}`);
    }

    // Create tasks for the first user (demo user)
    console.log('📋 Creating tasks...');
    const demoUser = createdUsers[0];
    for (const taskData of sampleTasks) {
      const task = new Task({
        ...taskData,
        userId: demoUser._id
      });
      await task.save();
      console.log(`✅ Created task: ${taskData.title}`);
    }

    console.log('');
    console.log('🎉 Database seeding completed successfully!');
    console.log('');
    console.log('📊 Seeded data summary:');
    console.log(`  Users: ${createdUsers.length}`);
    console.log(`  Categories: ${createdCategories.length}`);
    console.log(`  Tasks: ${sampleTasks.length}`);
    console.log('');
    console.log('🔑 Demo account credentials:');
    console.log('  Email: demo@taskmind.com');
    console.log('  Password: Demo123!');
    */

    console.log('⚠️  Models not yet created. Please uncomment the seeding code after creating the models.');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the seeding function
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, sampleUsers, sampleCategories, sampleTasks }; 