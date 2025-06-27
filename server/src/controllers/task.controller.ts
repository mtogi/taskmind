import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { taskQueries } from '../database/queries';

// Get all tasks for the authenticated user
export const getTasks = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    const tasks = await taskQueries.findByUserId(userId);

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

    const task = await taskQueries.findById(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    // Check if the task belongs to the user
    if (task.assignee_id !== userId) {
      return res.status(403).json({ message: 'Access denied.' });
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

    const task = await taskQueries.create({
      id: uuidv4(),
      title,
      description,
      status: status || 'TODO',
      priority: priority || 'MEDIUM',
      due_date: dueDate ? new Date(dueDate) : undefined,
      assignee_id: userId,
      project_id: projectId,
      parent_task_id: parentTaskId,
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
    const existingTask = await taskQueries.findById(id);

    if (!existingTask) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    if (existingTask.assignee_id !== userId) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const updates: any = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (status !== undefined) updates.status = status;
    if (priority !== undefined) updates.priority = priority;
    if (dueDate !== undefined) updates.due_date = dueDate ? new Date(dueDate) : null;
    if (projectId !== undefined) updates.project_id = projectId;

    const updatedTask = await taskQueries.update(id, updates);

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found.' });
    }

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
    const existingTask = await taskQueries.findById(id);

    if (!existingTask) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    if (existingTask.assignee_id !== userId) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const deleted = await taskQueries.delete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    return res.status(200).json({ message: 'Task deleted successfully.' });
  } catch (error) {
    console.error('Error deleting task:', error);
    return res.status(500).json({ message: 'Error deleting task.' });
  }
};

// Get subtasks for a task
export const getSubtasks = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    // Check if the parent task exists and belongs to the user
    const parentTask = await taskQueries.findById(taskId);

    if (!parentTask) {
      return res.status(404).json({ message: 'Parent task not found.' });
    }

    if (parentTask.assignee_id !== userId) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const subtasks = await taskQueries.findSubtasks(taskId);

    return res.status(200).json(subtasks);
  } catch (error) {
    console.error('Error fetching subtasks:', error);
    return res.status(500).json({ message: 'Error fetching subtasks.' });
  }
}; 