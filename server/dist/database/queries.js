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
Object.defineProperty(exports, "__esModule", { value: true });
exports.invitationQueries = exports.subscriptionQueries = exports.projectQueries = exports.taskQueries = exports.userQueries = void 0;
const connection_1 = require("./connection");
// User queries
exports.userQueries = {
    // Find user by email
    findByEmail: (email) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield connection_1.pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0] || null;
    }),
    // Find user by ID
    findById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield connection_1.pool.query('SELECT * FROM users WHERE id = $1', [id]);
        return result.rows[0] || null;
    }),
    // Create new user
    create: (userData) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield connection_1.pool.query(`INSERT INTO users (id, email, password, name, avatar)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`, [userData.id, userData.email, userData.password, userData.name, userData.avatar]);
        return result.rows[0];
    }),
    // Update user
    update: (id, updates) => __awaiter(void 0, void 0, void 0, function* () {
        const fields = Object.keys(updates).map((key, index) => `${key} = $${index + 2}`);
        const values = Object.values(updates);
        const result = yield connection_1.pool.query(`UPDATE users SET ${fields.join(', ')} WHERE id = $1 RETURNING *`, [id, ...values]);
        return result.rows[0] || null;
    }),
    // Update user by email
    updateByEmail: (email, updates) => __awaiter(void 0, void 0, void 0, function* () {
        const fields = Object.keys(updates).map((key, index) => `${key} = $${index + 2}`);
        const values = Object.values(updates);
        const result = yield connection_1.pool.query(`UPDATE users SET ${fields.join(', ')} WHERE email = $1 RETURNING *`, [email, ...values]);
        return result.rows[0] || null;
    }),
};
// Task queries
exports.taskQueries = {
    // Find all tasks for a user
    findByUserId: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield connection_1.pool.query(`SELECT t.*, p.name as project_name, u.name as assignee_name
       FROM tasks t
       LEFT JOIN projects p ON t.project_id = p.id
       LEFT JOIN users u ON t.assignee_id = u.id
       WHERE t.assignee_id = $1 OR t.project_id IN (
         SELECT project_id FROM project_members WHERE user_id = $1
       )
       ORDER BY t.created_at DESC`, [userId]);
        return result.rows;
    }),
    // Find task by ID
    findById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield connection_1.pool.query(`SELECT t.*, p.name as project_name, u.name as assignee_name
       FROM tasks t
       LEFT JOIN projects p ON t.project_id = p.id
       LEFT JOIN users u ON t.assignee_id = u.id
       WHERE t.id = $1`, [id]);
        return result.rows[0] || null;
    }),
    // Create new task
    create: (taskData) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield connection_1.pool.query(`INSERT INTO tasks (id, title, description, status, priority, due_date, assignee_id, project_id, parent_task_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`, [
            taskData.id,
            taskData.title,
            taskData.description,
            taskData.status || 'TODO',
            taskData.priority || 'MEDIUM',
            taskData.due_date,
            taskData.assignee_id,
            taskData.project_id,
            taskData.parent_task_id,
        ]);
        return result.rows[0];
    }),
    // Update task
    update: (id, updates) => __awaiter(void 0, void 0, void 0, function* () {
        const fields = Object.keys(updates).map((key, index) => `${key} = $${index + 2}`);
        const values = Object.values(updates);
        const result = yield connection_1.pool.query(`UPDATE tasks SET ${fields.join(', ')} WHERE id = $1 RETURNING *`, [id, ...values]);
        return result.rows[0] || null;
    }),
    // Delete task
    delete: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield connection_1.pool.query('DELETE FROM tasks WHERE id = $1', [id]);
        return (result.rowCount || 0) > 0;
    }),
    // Find subtasks
    findSubtasks: (parentTaskId) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield connection_1.pool.query('SELECT * FROM tasks WHERE parent_task_id = $1 ORDER BY created_at ASC', [parentTaskId]);
        return result.rows;
    }),
    // Find tasks by project
    findByProjectId: (projectId) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield connection_1.pool.query(`SELECT t.*, u.name as assignee_name
       FROM tasks t
       LEFT JOIN users u ON t.assignee_id = u.id
       WHERE t.project_id = $1
       ORDER BY t.created_at DESC`, [projectId]);
        return result.rows;
    }),
};
// Project queries
exports.projectQueries = {
    // Find all projects for a user
    findByUserId: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield connection_1.pool.query(`SELECT p.*, u.name as owner_name
       FROM projects p
       LEFT JOIN users u ON p.owner_id = u.id
       WHERE p.owner_id = $1 OR p.id IN (
         SELECT project_id FROM project_members WHERE user_id = $1
       )
       ORDER BY p.created_at DESC`, [userId]);
        return result.rows;
    }),
    // Find project by ID
    findById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield connection_1.pool.query(`SELECT p.*, u.name as owner_name
       FROM projects p
       LEFT JOIN users u ON p.owner_id = u.id
       WHERE p.id = $1`, [id]);
        return result.rows[0] || null;
    }),
    // Create new project
    create: (projectData) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield connection_1.pool.query(`INSERT INTO projects (id, name, description, owner_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`, [projectData.id, projectData.name, projectData.description, projectData.owner_id]);
        return result.rows[0];
    }),
    // Update project
    update: (id, updates) => __awaiter(void 0, void 0, void 0, function* () {
        const fields = Object.keys(updates).map((key, index) => `${key} = $${index + 2}`);
        const values = Object.values(updates);
        const result = yield connection_1.pool.query(`UPDATE projects SET ${fields.join(', ')} WHERE id = $1 RETURNING *`, [id, ...values]);
        return result.rows[0] || null;
    }),
    // Delete project
    delete: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield connection_1.pool.query('DELETE FROM projects WHERE id = $1', [id]);
        return (result.rowCount || 0) > 0;
    }),
    // Add member to project
    addMember: (projectId, userId) => __awaiter(void 0, void 0, void 0, function* () {
        yield connection_1.pool.query(`INSERT INTO project_members (project_id, user_id)
       VALUES ($1, $2)
       ON CONFLICT DO NOTHING`, [projectId, userId]);
    }),
    // Remove member from project
    removeMember: (projectId, userId) => __awaiter(void 0, void 0, void 0, function* () {
        yield connection_1.pool.query('DELETE FROM project_members WHERE project_id = $1 AND user_id = $2', [projectId, userId]);
    }),
    // Get project members
    getMembers: (projectId) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield connection_1.pool.query(`SELECT u.* FROM users u
       INNER JOIN project_members pm ON u.id = pm.user_id
       WHERE pm.project_id = $1`, [projectId]);
        return result.rows;
    }),
};
// Subscription queries
exports.subscriptionQueries = {
    // Find subscription by user ID
    findByUserId: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield connection_1.pool.query('SELECT * FROM subscriptions WHERE user_id = $1', [userId]);
        return result.rows[0] || null;
    }),
    // Create or update subscription
    upsert: (subscriptionData) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield connection_1.pool.query(`INSERT INTO subscriptions (id, user_id, plan_id, status, current_period_end, stripe_subscription_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (user_id) DO UPDATE SET
         plan_id = EXCLUDED.plan_id,
         status = EXCLUDED.status,
         current_period_end = EXCLUDED.current_period_end,
         stripe_subscription_id = EXCLUDED.stripe_subscription_id,
         updated_at = CURRENT_TIMESTAMP
       RETURNING *`, [
            subscriptionData.id,
            subscriptionData.user_id,
            subscriptionData.plan_id,
            subscriptionData.status,
            subscriptionData.current_period_end,
            subscriptionData.stripe_subscription_id,
        ]);
        return result.rows[0];
    }),
    // Delete subscription
    delete: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield connection_1.pool.query('DELETE FROM subscriptions WHERE user_id = $1', [userId]);
        return (result.rowCount || 0) > 0;
    }),
};
// Invitation queries
exports.invitationQueries = {
    // Find invitation by token
    findByToken: (token) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield connection_1.pool.query('SELECT * FROM invitations WHERE token = $1', [token]);
        return result.rows[0] || null;
    }),
    // Create invitation
    create: (invitationData) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield connection_1.pool.query(`INSERT INTO invitations (id, email, token, project_id, invited_by_id, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`, [
            invitationData.id,
            invitationData.email,
            invitationData.token,
            invitationData.project_id,
            invitationData.invited_by_id,
            invitationData.expires_at,
        ]);
        return result.rows[0];
    }),
    // Update invitation status
    updateStatus: (id, status) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield connection_1.pool.query('UPDATE invitations SET status = $1 WHERE id = $2 RETURNING *', [status, id]);
        return result.rows[0] || null;
    }),
    // Delete expired invitations
    deleteExpired: () => __awaiter(void 0, void 0, void 0, function* () {
        yield connection_1.pool.query('DELETE FROM invitations WHERE expires_at < CURRENT_TIMESTAMP');
    }),
};
