import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // Create a demo user
  const hashedPassword = await bcrypt.hash('password123', 12);
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@taskmind.com' },
    update: {},
    create: {
      email: 'demo@taskmind.com',
      name: 'Demo User',
      password: hashedPassword,
      isEmailVerified: true,
    },
  });

  console.log(`Created demo user with id: ${demoUser.id}`);
  
  // Create a test account for local development
  const testPasswordHash = await bcrypt.hash('testpassword123', 12);
  const testUser = await prisma.user.upsert({
    where: { email: 'test@taskmind.dev' },
    update: {},
    create: {
      email: 'test@taskmind.dev',
      name: 'Test User',
      password: testPasswordHash,
      isEmailVerified: true,
    },
  });
  
  console.log(`Created test user with id: ${testUser.id}`);

  // Create a demo project
  const demoProject = await prisma.project.upsert({
    where: { id: 'demo-project-id' },
    update: {},
    create: {
      id: 'demo-project-id',
      name: 'Demo Project',
      description: 'This is a demo project for testing purposes.',
      ownerId: demoUser.id,
    },
  });

  console.log(`Created demo project with id: ${demoProject.id}`);
  
  // Create a test project for the test user
  const testProject = await prisma.project.upsert({
    where: { id: 'test-project-id' },
    update: {},
    create: {
      id: 'test-project-id',
      name: 'Test Project',
      description: 'This is a test project for development purposes.',
      ownerId: testUser.id,
    },
  });
  
  console.log(`Created test project with id: ${testProject.id}`);

  // Create some demo tasks
  const demoTasks = [
    {
      title: 'Set up project structure',
      description: 'Create the initial project structure and organize files.',
      status: 'DONE',
      priority: 'HIGH',
      dueDate: new Date('2023-07-01'),
    },
    {
      title: 'Design database schema',
      description: 'Create the database schema for the application.',
      status: 'DONE',
      priority: 'HIGH',
      dueDate: new Date('2023-07-05'),
    },
    {
      title: 'Implement authentication',
      description: 'Implement user authentication and authorization.',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      dueDate: new Date('2023-07-10'),
    },
    {
      title: 'Create API endpoints',
      description: 'Implement API endpoints for the application.',
      status: 'TODO',
      priority: 'MEDIUM',
      dueDate: new Date('2023-07-15'),
    },
    {
      title: 'Write tests',
      description: 'Write unit tests and integration tests.',
      status: 'TODO',
      priority: 'LOW',
      dueDate: new Date('2023-07-20'),
    },
  ];

  for (const taskData of demoTasks) {
    const task = await prisma.task.create({
      data: {
        ...taskData,
        assigneeId: demoUser.id,
        projectId: demoProject.id,
      },
    });
    console.log(`Created demo task with id: ${task.id}`);
  }
  
  // Create some test tasks for the test user
  const testTasks = [
    {
      title: 'Complete project setup',
      description: 'Finish setting up the project structure.',
      status: 'DONE',
      priority: 'HIGH',
      dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    },
    {
      title: 'Implement user authentication',
      description: 'Add user login and registration functionality.',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
    },
    {
      title: 'Design UI components',
      description: 'Create reusable UI components for the application.',
      status: 'TODO',
      priority: 'MEDIUM',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    },
    {
      title: 'Write documentation',
      description: 'Document the project structure and API endpoints.',
      status: 'TODO',
      priority: 'LOW',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    },
  ];
  
  for (const taskData of testTasks) {
    const task = await prisma.task.create({
      data: {
        ...taskData,
        assigneeId: testUser.id,
        projectId: testProject.id,
      },
    });
    console.log(`Created test task with id: ${task.id}`);
  }

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 