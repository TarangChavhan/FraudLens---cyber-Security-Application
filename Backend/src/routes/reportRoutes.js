import { Router } from 'express';
import {
  getAllReports,
  getMyReports,
  getReportById,
  createReport,
  assignExpert,
  updateReportStatus,
  getReportStats,
} from '../controllers/reportController.js';

const router = Router();

router.get('/', getAllReports);
router.get('/stats', getReportStats);
router.get('/my', getMyReports);
router.get('/:id', getReportById);
router.post('/', createReport);
router.patch('/:id/expert', assignExpert);
router.patch('/:id/status', updateReportStatus);

export default router;
