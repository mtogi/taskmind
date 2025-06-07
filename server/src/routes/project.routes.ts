import express from 'express';
import { 
  getProjects, 
  getProjectById, 
  createProject, 
  updateProject, 
  deleteProject,
  getProjectStats
} from '../controllers/project.controller';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

// Apply authentication middleware to all project routes
router.use(authenticate);

// Project routes
router.get('/', getProjects);
router.get('/:id', getProjectById);
router.post('/', createProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);
router.get('/:id/stats', getProjectStats);

export default router; 