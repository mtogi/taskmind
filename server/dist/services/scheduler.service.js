"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.stopScheduler = exports.initScheduler = void 0;
const cron_1 = require("cron");
const index_1 = require("../index");
const date_fns_1 = require("date-fns");
const emailService = __importStar(require("./email.service"));
// Scheduled jobs collection
const scheduledJobs = {};
// Initialize scheduler service
const initScheduler = () => {
    // Schedule daily reminder for tasks due soon
    scheduledJobs.taskReminders = new cron_1.CronJob('0 9 * * *', // Run every day at 9:00 AM
    () => __awaiter(void 0, void 0, void 0, function* () {
        yield sendTaskReminders();
    }), null, true, 'UTC');
    console.log('Task reminder scheduler initialized');
};
exports.initScheduler = initScheduler;
// Send reminders for tasks due soon
const sendTaskReminders = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Running task reminder job...');
        const today = (0, date_fns_1.startOfDay)(new Date());
        const reminderThreshold = (0, date_fns_1.addDays)(today, 2); // Remind for tasks due in the next 2 days
        // Get all tasks due soon that haven't been completed
        const tasksDueSoon = yield index_1.prisma.task.findMany({
            where: {
                status: {
                    not: 'DONE',
                },
                dueDate: {
                    gte: today,
                    lte: reminderThreshold,
                },
                reminderSent: false, // Only send reminder once
            },
            include: {
                assignee: true,
            },
        });
        console.log(`Found ${tasksDueSoon.length} tasks due soon`);
        for (const task of tasksDueSoon) {
            // Skip tasks without assignees or due dates
            if (!task.assignee || !task.dueDate)
                continue;
            // Send reminder email
            const success = yield emailService.sendTaskReminder(task.assignee, task.title, task.dueDate);
            if (success) {
                // Mark reminder as sent
                yield index_1.prisma.task.update({
                    where: { id: task.id },
                    data: { reminderSent: true },
                });
                console.log(`Sent reminder for task: ${task.id} - ${task.title}`);
            }
        }
        console.log('Task reminder job completed');
    }
    catch (error) {
        console.error('Error in task reminder job:', error);
    }
});
// Stop all scheduled jobs
const stopScheduler = () => {
    Object.values(scheduledJobs).forEach(job => {
        // Check if the job is running (using a safe way)
        try {
            // Just call stop regardless of running state
            job.stop();
        }
        catch (error) {
            console.error('Error stopping cron job:', error);
        }
    });
    console.log('Task scheduler stopped');
};
exports.stopScheduler = stopScheduler;
