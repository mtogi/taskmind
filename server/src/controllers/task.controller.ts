import { Request, Response } from 'express';
import { prisma } from '../index';

// Get all tasks for the authenticated user
export const getTasks = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    const tasks = await prisma.task.findMany({
      where: {
        assigneeId: userId,
      },
      include: {
        subtasks: true,
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return res.status(500).json({ message: 'Error fetching tasks.' });
  }
};

// Get a single task by ID
export const getTaskById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    const task = await prisma.task.findFirst({
      where: {
        id,
        assigneeId: userId,
      },
      include: {
        subtasks: true,
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    return res.status(200).json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    return res.status(500).json({ message: 'Error fetching task.' });
  }
};

// Create a new task
export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, status, priority, dueDate, projectId, parentTaskId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || 'TODO',
        priority: priority || 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : undefined,
        assignee: {
          connect: { id: userId },
        },
        project: projectId ? {
          connect: { id: projectId },
        } : undefined,
        parentTask: parentTaskId ? {
          connect: { id: parentTaskId },
        } : undefined,
      },
      include: {
        subtasks: true,
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    return res.status(500).json({ message: 'Error creating task.' });
  }
};

// Update an existing task
export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, dueDate, projectId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    // Check if the task exists and belongs to the user
    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        assigneeId: userId,
      },
    });

    if (!existingTask) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        project: projectId ? {
          connect: { id: projectId },
        } : undefined,
      },
      include: {
        subtasks: true,
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    return res.status(500).json({ message: 'Error updating task.' });
  }
};

// Delete a task
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    // Check if the task exists and belongs to the user
    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        assigneeId: userId,
      },
    });

    if (!existingTask) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    await prisma.task.delete({
      where: { id },
    });

    return res.status(200).json({ message: 'Task deleted successfully.' });
  } catch (error) {
    console.error('Error deleting task:', error);
    return res.status(500).json({ message: 'Error deleting task.' });
  }
}; 