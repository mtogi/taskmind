import { CronJob } from 'cron';
import { addDays, isAfter, isBefore, startOfDay } from 'date-fns';
import { taskQueries, userQueries } from '../database/queries';
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
    // We'll need to get all tasks and filter them in memory since we're using raw SQL
    const allTasks = await taskQueries.findByUserId(''); // This will need to be updated to get all tasks
    
    const tasksDueSoon = allTasks.filter(task => 
      task.status !== 'DONE' &&
      task.due_date &&
      task.due_date >= today &&
      task.due_date <= reminderThreshold &&
      !task.reminder_sent
    );
    
    console.log(`Found ${tasksDueSoon.length} tasks due soon`);
    
    for (const task of tasksDueSoon) {
      // Skip tasks without assignees or due dates
      if (!task.assignee_id || !task.due_date) continue;
      
      // Get user details
      const user = await userQueries.findById(task.assignee_id);
      if (!user) continue;
      
      // Send reminder email
      const success = await emailService.sendTaskReminder(
        user,
        task.title,
        task.due_date
      );
      
      if (success) {
        // Mark reminder as sent
        await taskQueries.update(task.id, { reminder_sent: true });
        
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