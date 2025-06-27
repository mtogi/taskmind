"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = require("./connection");
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const seedData = () => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield connection_1.pool.connect();
    try {
        console.log('🌱 Seeding database with test data...');
        // Create demo user
        const demoPasswordHash = yield bcrypt_1.default.hash('password123', 12);
        const demoUserId = (0, uuid_1.v4)();
        yield client.query(`
      INSERT INTO users (id, email, password, name, is_email_verified)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email) DO NOTHING
    `, [demoUserId, 'demo@taskmind.com', demoPasswordHash, 'Demo User', true]);
        // Create test user
        const testPasswordHash = yield bcrypt_1.default.hash('testpassword123', 12);
        const testUserId = (0, uuid_1.v4)();
        yield client.query(`
      INSERT INTO users (id, email, password, name, is_email_verified)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email) DO NOTHING
    `, [testUserId, 'test@taskmind.dev', testPasswordHash, 'Test User', true]);
        // Create demo project
        const demoProjectId = (0, uuid_1.v4)();
        yield client.query(`
      INSERT INTO projects (id, name, description, owner_id)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT DO NOTHING
    `, [demoProjectId, 'Demo Project', 'This is a demo project for testing purposes.', demoUserId]);
        // Create test project
        const testProjectId = (0, uuid_1.v4)();
        yield client.query(`
      INSERT INTO projects (id, name, description, owner_id)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT DO NOTHING
    `, [testProjectId, 'Test Project', 'This is a test project for development purposes.', testUserId]);
        // Create demo tasks
        const demoTasks = [
            {
                title: 'Set up project structure',
                description: 'Create the initial project structure and organize files.',
                status: 'DONE',
                priority: 'HIGH',
                due_date: new Date('2023-07-01'),
            },
            {
                title: 'Design database schema',
                description: 'Create the database schema for the application.',
                status: 'DONE',
                priority: 'HIGH',
                due_date: new Date('2023-07-05'),
            },
            {
                title: 'Implement authentication',
                description: 'Implement user authentication and authorization.',
                status: 'IN_PROGRESS',
                priority: 'HIGH',
                due_date: new Date('2023-07-10'),
            },
            {
                title: 'Create API endpoints',
                description: 'Implement API endpoints for the application.',
                status: 'TODO',
                priority: 'MEDIUM',
                due_date: new Date('2023-07-15'),
            },
            {
                title: 'Write tests',
                description: 'Write unit tests and integration tests.',
                status: 'TODO',
                priority: 'LOW',
                due_date: new Date('2023-07-20'),
            },
        ];
        for (const taskData of demoTasks) {
            yield client.query(`
        INSERT INTO tasks (id, title, description, status, priority, due_date, assignee_id, project_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT DO NOTHING
      `, [
                (0, uuid_1.v4)(),
                taskData.title,
                taskData.description,
                taskData.status,
                taskData.priority,
                taskData.due_date,
                demoUserId,
                demoProjectId,
            ]);
        }
        // Create test tasks
        const testTasks = [
            {
                title: 'Complete project setup',
                description: 'Finish setting up the project structure.',
                status: 'DONE',
                priority: 'HIGH',
                due_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
            },
            {
                title: 'Implement user authentication',
                description: 'Add user login and registration functionality.',
                status: 'IN_PROGRESS',
                priority: 'HIGH',
                due_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
            },
            {
                title: 'Design UI components',
                description: 'Create reusable UI components for the application.',
                status: 'TODO',
                priority: 'MEDIUM',
                due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
            },
            {
                title: 'Write documentation',
                description: 'Document the project structure and API endpoints.',
                status: 'TODO',
                priority: 'LOW',
                due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
            },
        ];
        for (const taskData of testTasks) {
            yield client.query(`
        INSERT INTO tasks (id, title, description, status, priority, due_date, assignee_id, project_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT DO NOTHING
      `, [
                (0, uuid_1.v4)(),
                taskData.title,
                taskData.description,
                taskData.status,
                taskData.priority,
                taskData.due_date,
                testUserId,
                testProjectId,
            ]);
        }
        console.log('✅ Database seeded successfully!');
        console.log('📧 Demo user: demo@taskmind.com / password123');
        console.log('📧 Test user: test@taskmind.dev / testpassword123');
    }
    catch (error) {
        console.error('❌ Error seeding database:', error);
        throw error;
    }
    finally {
        client.release();
    }
});
// Main execution
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield seedData();
    }
    catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
    finally {
        yield connection_1.pool.end();
    }
});
if (require.main === module) {
    main();
}
