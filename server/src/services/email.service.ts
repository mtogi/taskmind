import nodemailer from 'nodemailer';
import config from '../config/config';
import { formatDistanceToNow } from 'date-fns';
import { DatabaseUser } from '../database/connection';

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.secure,
  auth: {
    user: config.email.user,
    pass: config.email.password,
  },
});

// Email templates
const EMAIL_TEMPLATES = {
  taskReminder: (taskTitle: string, dueDate: Date, userName: string) => ({
    subject: `Reminder: Task "${taskTitle}" is due soon`,
    text: `Hello ${userName},\n\nThis is a reminder that your task "${taskTitle}" is due ${formatDistanceToNow(dueDate, { addSuffix: true })}.\n\nTask: ${taskTitle}\nDue Date: ${dueDate.toLocaleDateString()}\n\nBest regards,\nTaskMind Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #7c3aed; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">Task Reminder</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #e2e8f0; border-top: none;">
          <p>Hello ${userName},</p>
          <p>This is a reminder that your task is due ${formatDistanceToNow(dueDate, { addSuffix: true })}.</p>
          <div style="background-color: #f8fafc; border-left: 4px solid #7c3aed; padding: 15px; margin: 20px 0;">
            <h2 style="margin-top: 0; color: #1e293b;">${taskTitle}</h2>
            <p style="margin-bottom: 0;">Due Date: ${dueDate.toLocaleDateString()}</p>
          </div>
          <p>Please login to your TaskMind account to view and update this task.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${config.appUrl}" style="background-color: #7c3aed; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Go to TaskMind</a>
          </div>
          <p>Best regards,<br>TaskMind Team</p>
        </div>
        <div style="background-color: #f1f5f9; padding: 10px; text-align: center; font-size: 12px; color: #64748b;">
          <p>This is an automated message, please do not reply to this email.</p>
        </div>
      </div>
    `,
  }),
  
  welcome: (userName: string, verificationLink?: string) => ({
    subject: 'Welcome to TaskMind!',
    text: `Hello ${userName},\n\nWelcome to TaskMind! We're excited to have you on board.\n\n${verificationLink ? `Please verify your email by clicking this link: ${verificationLink}\n\n` : ''}Feel free to reach out if you have any questions.\n\nBest regards,\nTaskMind Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #7c3aed; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">Welcome to TaskMind!</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #e2e8f0; border-top: none;">
          <p>Hello ${userName},</p>
          <p>Welcome to TaskMind! We're excited to have you on board.</p>
          ${verificationLink ? `
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" style="background-color: #7c3aed; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Your Email</a>
          </div>
          ` : ''}
          <p>Here are some things you can do with TaskMind:</p>
          <ul>
            <li>Create and organize tasks</li>
            <li>Set priorities and due dates</li>
            <li>Track your progress</li>
            <li>Collaborate with team members</li>
          </ul>
          <p>Feel free to reach out if you have any questions.</p>
          <p>Best regards,<br>TaskMind Team</p>
        </div>
        <div style="background-color: #f1f5f9; padding: 10px; text-align: center; font-size: 12px; color: #64748b;">
          <p>This is an automated message, please do not reply to this email.</p>
        </div>
      </div>
    `,
  }),
  
  passwordReset: (userName: string, resetLink: string) => ({
    subject: 'Password Reset Request',
    text: `Hello ${userName},\n\nWe received a request to reset your password. Please click the link below to reset your password:\n\n${resetLink}\n\nIf you didn't request this, you can safely ignore this email.\n\nBest regards,\nTaskMind Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #7c3aed; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">Password Reset</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #e2e8f0; border-top: none;">
          <p>Hello ${userName},</p>
          <p>We received a request to reset your password. Please click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #7c3aed; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
          </div>
          <p>If you didn't request this, you can safely ignore this email.</p>
          <p>Best regards,<br>TaskMind Team</p>
        </div>
        <div style="background-color: #f1f5f9; padding: 10px; text-align: center; font-size: 12px; color: #64748b;">
          <p>This is an automated message, please do not reply to this email.</p>
          <p>Link expires in 1 hour.</p>
        </div>
      </div>
    `,
  }),
};

// Send task reminder email
export const sendTaskReminder = async (
  user: DatabaseUser,
  taskTitle: string,
  dueDate: Date
): Promise<boolean> => {
  try {
    const { subject, text, html } = EMAIL_TEMPLATES.taskReminder(
      taskTitle,
      dueDate,
      user.name
    );

    const info = await transporter.sendMail({
      from: `"TaskMind" <${config.email.from}>`,
      to: user.email,
      subject,
      text,
      html,
    });

    console.log('Task reminder email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending task reminder email:', error);
    return false;
  }
};

// Send welcome email
export const sendWelcomeEmail = async (
  user: DatabaseUser,
  verificationLink?: string
): Promise<boolean> => {
  try {
    const { subject, text, html } = EMAIL_TEMPLATES.welcome(
      user.name,
      verificationLink
    );

    const info = await transporter.sendMail({
      from: `"TaskMind" <${config.email.from}>`,
      to: user.email,
      subject,
      text,
      html,
    });

    console.log('Welcome email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (
  user: DatabaseUser,
  resetToken: string
): Promise<boolean> => {
  try {
    const resetLink = `${config.appUrl}/reset-password?token=${resetToken}`;
    const { subject, text, html } = EMAIL_TEMPLATES.passwordReset(
      user.name,
      resetLink
    );

    const info = await transporter.sendMail({
      from: `"TaskMind" <${config.email.from}>`,
      to: user.email,
      subject,
      text,
      html,
    });

    console.log('Password reset email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
}; 