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