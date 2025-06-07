import { CronJob } from 'cron';
import { prisma } from '../index';
import { PrismaClient } from '@prisma/client';
import { addDays, isAfter, isBefore, startOfDay } from 'date-fns';
import * as emailService from './email.service';

// Scheduled jobs collection
const scheduledJobs: { [key: string]: CronJob } = {};

// Initialize scheduler service
export const initScheduler = () => {
  // Schedule daily reminder for tasks due soon
  scheduledJobs.taskReminders = new CronJob(
    '0 9 * * *', // Run every day at 9:00 AM
    async () => {
      await sendTaskReminders();
    },
    null,
    true,
    'UTC'
  );

  console.log('Task reminder scheduler initialized');
};

// Send reminders for tasks due soon
const sendTaskReminders = async () => {
  try {
    console.log('Running task reminder job...');
    
    const today = startOfDay(new Date());
    const reminderThreshold = addDays(today, 2); // Remind for tasks due in the next 2 days
    
    // Get all tasks due soon that haven't been completed
    const tasksDueSoon = await prisma.task.findMany({
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
      if (!task.assignee || !task.dueDate) continue;
      
      // Send reminder email
      const success = await emailService.sendTaskReminder(
        task.assignee,
        task.title,
        task.dueDate
      );
      
      if (success) {
        // Mark reminder as sent
        await prisma.task.update({
          where: { id: task.id },
          data: { reminderSent: true },
        });
        
        console.log(`Sent reminder for task: ${task.id} - ${task.title}`);
      }
    }
    
    console.log('Task reminder job completed');
  } catch (error) {
    console.error('Error in task reminder job:', error);
  }
};

// Stop all scheduled jobs
export const stopScheduler = () => {
  Object.values(scheduledJobs).forEach(job => {
    // Check if the job is running (using a safe way)
    try {
      // Just call stop regardless of running state
      job.stop();
    } catch (error) {
      console.error('Error stopping cron job:', error);
    }
  });
  
  console.log('Task scheduler stopped');
}; 