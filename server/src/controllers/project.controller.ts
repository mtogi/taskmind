import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { projectQueries, taskQueries } from '../database/queries';

// Get all projects for the authenticated user
export const getProjects = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    const projects = await projectQueries.findByUserId(userId);

    return res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return res.status(500).json({ message: 'Error fetching projects.' });
  }
};

// Get a single project by ID
export const getProjectById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    const project = await projectQueries.findById(id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    // Check if user has access to the project
    const members = await projectQueries.getMembers(id);
    const hasAccess = project.owner_id === userId || members.some(member => member.id === userId);

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    // Get project tasks
    const tasks = await taskQueries.findByProjectId(id);

    const projectWithTasks = {
      ...project,
      tasks,
      members,
    };

    return res.status(200).json(projectWithTasks);
  } catch (error) {
    console.error('Error fetching project:', error);
    return res.status(500).json({ message: 'Error fetching project.' });
  }
};

// Create a new project
export const createProject = async (req: Request, res: Response) => {
  try {
    const { name, description, memberIds } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    // Validate input
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Project name is required.' });
    }

    const project = await projectQueries.create({
      id: uuidv4(),
      name,
      description,
      owner_id: userId,
    });

    // Add members if provided
    if (memberIds && memberIds.length > 0) {
      for (const memberId of memberIds) {
        await projectQueries.addMember(project.id, memberId);
      }
    }

    // Get the created project with members
    const members = await projectQueries.getMembers(project.id);
    const projectWithMembers = {
      ...project,
      members,
    };

    return res.status(201).json(projectWithMembers);
  } catch (error) {
    console.error('Error creating project:', error);
    return res.status(500).json({ message: 'Error creating project.' });
  }
};

// Update an existing project
export const updateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, memberIds } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    // Check if the project exists and user is the owner
    const existingProject = await projectQueries.findById(id);

    if (!existingProject) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    if (existingProject.owner_id !== userId) {
      return res.status(403).json({ 
        message: 'You do not have permission to update this project.' 
      });
    }

    // Update project
    const updates: any = {};
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;

    const updatedProject = await projectQueries.update(id, updates);

    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    // Update members if provided
    if (memberIds) {
      // Remove all current members
      const currentMembers = await projectQueries.getMembers(id);
      for (const member of currentMembers) {
        await projectQueries.removeMember(id, member.id);
      }

      // Add new members
      for (const memberId of memberIds) {
        await projectQueries.addMember(id, memberId);
      }
    }

    // Get updated project with members
    const members = await projectQueries.getMembers(id);
    const projectWithMembers = {
      ...updatedProject,
      members,
    };

    return res.status(200).json(projectWithMembers);
  } catch (error) {
    console.error('Error updating project:', error);
    return res.status(500).json({ message: 'Error updating project.' });
  }
};

// Delete a project
export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    // Check if the project exists and user is the owner
    const existingProject = await projectQueries.findById(id);

    if (!existingProject) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    if (existingProject.owner_id !== userId) {
      return res.status(403).json({ 
        message: 'You do not have permission to delete this project.' 
      });
    }

    const deleted = await projectQueries.delete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    return res.status(200).json({ message: 'Project deleted successfully.' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return res.status(500).json({ message: 'Error deleting project.' });
  }
};

// Get project statistics
export const getProjectStats = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    const project = await projectQueries.findById(id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    // Check if user has access to the project
    const members = await projectQueries.getMembers(id);
    const hasAccess = project.owner_id === userId || members.some(member => member.id === userId);

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    // Get project tasks
    const tasks = await taskQueries.findByProjectId(id);

    // Calculate statistics
    const stats = {
      totalTasks: tasks.length,
      completedTasks: tasks.filter(task => task.status === 'DONE').length,
      inProgressTasks: tasks.filter(task => task.status === 'IN_PROGRESS').length,
      pendingTasks: tasks.filter(task => task.status === 'TODO').length,
      highPriorityTasks: tasks.filter(task => task.priority === 'HIGH').length,
      overdueTasks: tasks.filter(task => 
        task.due_date && new Date(task.due_date) < new Date() && task.status !== 'DONE'
      ).length,
    };

    return res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching project stats:', error);
    return res.status(500).json({ message: 'Error fetching project statistics.' });
  }
}; 