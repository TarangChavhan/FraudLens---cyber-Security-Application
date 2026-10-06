import express from 'express';
import { getDashboardStats, getExpertsList, getAllUsers } from '../controllers/adminController.js';

const router = express.Router();

// Allow reading stats and experts list (with graceful access)
router.get('/stats', getDashboardStats);
router.get('/experts', getExpertsList);
router.get('/users', getAllUsers);

export default router;
