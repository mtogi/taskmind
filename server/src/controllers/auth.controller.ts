import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { userQueries } from '../database/queries';
import config from '../config/config';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    // Check if the user already exists
    const existingUser = await userQueries.findByEmail(email);

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the user
    const user = await userQueries.create({
      id: uuidv4(),
      email,
      password: hashedPassword,
      name,
    });

    // Generate a JWT token
    const jwtSecret = config.jwtSecret as string;
    const token = jwt.sign({ userId: user.id }, jwtSecret, { 
      expiresIn: '7d' // Hardcode the expiration as a simple solution
    });

    return res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Error registering user.' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await userQueries.findByEmail(email);

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Generate a JWT token
    const jwtSecret = config.jwtSecret as string;
    const token = jwt.sign({ userId: user.id }, jwtSecret, { 
      expiresIn: '7d' // Hardcode the expiration as a simple solution
    });

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Error during login.' });
  }
}; 