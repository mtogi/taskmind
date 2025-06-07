import { Request, Response } from 'express';
import { prisma } from '../index';

// Get all projects for the authenticated user
export const getProjects = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { members: { some: { id: userId } } },
        ],
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        members: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            tasks: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

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

    const project = await prisma.project.findFirst({
      where: {
        id,
        OR: [
          { ownerId: userId },
          { members: { some: { id: userId } } },
        ],
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        members: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        tasks: {
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            assignee: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    return res.status(200).json(project);
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

    // Prepare member connections if provided
    const memberConnections = memberIds && memberIds.length > 0
      ? {
          connect: memberIds.map((id: string) => ({ id })),
        }
      : undefined;

    const project = await prisma.project.create({
      data: {
        name,
        description,
        owner: {
          connect: { id: userId },
        },
        members: memberConnections,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        members: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return res.status(201).json(project);
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
    const existingProject = await prisma.project.findFirst({
      where: {
        id,
        ownerId: userId,
      },
    });

    if (!existingProject) {
      return res.status(404).json({ 
        message: 'Project not found or you do not have permission to update it.' 
      });
    }

    // Prepare member connections if provided
    let memberUpdateOperation;
    if (memberIds) {
      memberUpdateOperation = {
        set: memberIds.map((id: string) => ({ id })),
      };
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        name,
        description,
        members: memberUpdateOperation,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        members: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return res.status(200).json(updatedProject);
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
    const existingProject = await prisma.project.findFirst({
      where: {
        id,
        ownerId: userId,
      },
    });

    if (!existingProject) {
      return res.status(404).json({ 
        message: 'Project not found or you do not have permission to delete it.' 
      });
    }

    // Delete all tasks associated with the project first
    await prisma.task.deleteMany({
      where: {
        projectId: id,
      },
    });

    // Delete the project
    await prisma.project.delete({
      where: { id },
    });

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

    // Check if the project exists and user has access
    const existingProject = await prisma.project.findFirst({
      where: {
        id,
        OR: [
          { ownerId: userId },
          { members: { some: { id: userId } } },
        ],
      },
    });

    if (!existingProject) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    // Get task counts by status
    const taskStats = await prisma.task.groupBy({
      by: ['status'],
      where: {
        projectId: id,
      },
      _count: {
        status: true,
      },
    });

    // Get task counts by priority
    const priorityStats = await prisma.task.groupBy({
      by: ['priority'],
      where: {
        projectId: id,
      },
      _count: {
        priority: true,
      },
    });

    // Get count of overdue tasks
    const now = new Date();
    const overdueTasksCount = await prisma.task.count({
      where: {
        projectId: id,
        dueDate: {
          lt: now,
        },
        status: {
          not: 'DONE',
        },
      },
    });

    // Format the statistics
    const statistics = {
      tasksByStatus: taskStats.reduce((acc: Record<string, number>, curr: { status: string; _count: { status: number } }) => {
        acc[curr.status] = curr._count.status;
        return acc;
      }, {}),
      tasksByPriority: priorityStats.reduce((acc: Record<string, number>, curr: { priority: string; _count: { priority: number } }) => {
        acc[curr.priority] = curr._count.priority;
        return acc;
      }, {}),
      overdueTasks: overdueTasksCount,
      totalTasks: await prisma.task.count({
        where: {
          projectId: id,
        },
      }),
    };

    return res.status(200).json(statistics);
  } catch (error) {
    console.error('Error fetching project statistics:', error);
    return res.status(500).json({ message: 'Error fetching project statistics.' });
  }
}; 