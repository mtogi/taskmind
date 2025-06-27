import { Pool } from 'pg';
import { createClient } from '@supabase/supabase-js';
import config from '../config/config';

// PostgreSQL connection pool
export const pool = new Pool({
  connectionString: config.databaseUrl,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Supabase client for additional features
export const supabase = createClient(
  config.supabaseUrl,
  config.supabaseServiceKey
);

// Test database connection
export const testConnection = async (): Promise<boolean> => {
  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
};

// Graceful shutdown
export const closeConnection = async (): Promise<void> => {
  await pool.end();
  console.log('Database connection closed');
};

// Export types for database operations
export interface DatabaseUser {
  id: string;
  email: string;
  password: string;
  name: string;
  avatar?: string;
  is_email_verified: boolean;
  verification_token?: string;
  reset_password_token?: string;
  stripe_customer_id?: string;
  created_at: Date;
  updated_at: Date;
}

export interface DatabaseTask {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  due_date?: Date;
  reminder_sent: boolean;
  assignee_id?: string;
  project_id?: string;
  parent_task_id?: string;
  created_at: Date;
  updated_at: Date;
}

export interface DatabaseProject {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface DatabaseSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: string;
  current_period_end: Date;
  stripe_subscription_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface DatabaseInvitation {
  id: string;
  email: string;
  token: string;
  project_id: string;
  invited_by_id: string;
  status: string;
  expires_at: Date;
  created_at: Date;
  updated_at: Date;
} 