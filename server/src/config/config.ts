import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  jwtSecret: string;
  jwtExpiresIn: string | number;
  openaiApiKey: string;
  stripeSecretKey: string;
  stripeWebhookSecret: string;
  appUrl: string;
  enableScheduler: boolean;
  email: {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    password: string;
    from: string;
  };
  stripe: {
    secretKey: string;
    webhookSecret: string;
  };
}

const config: Config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  appUrl: process.env.APP_URL || 'http://localhost:3000',
  enableScheduler: process.env.ENABLE_SCHEDULER === 'true',
  email: {
    host: process.env.EMAIL_HOST || 'smtp.example.com',
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    secure: process.env.EMAIL_SECURE === 'true',
    user: process.env.EMAIL_USER || '',
    password: process.env.EMAIL_PASSWORD || '',
    from: process.env.EMAIL_FROM || 'noreply@taskmind.com',
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  },
};

export default config; 