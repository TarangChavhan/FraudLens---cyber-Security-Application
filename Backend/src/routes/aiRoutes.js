import express from 'express';
import { handleAnalyzeLink, handleAnalyzeReport, handleChat, getCheckHistory } from '../controllers/aiController.js';

const router = express.Router();

router.post('/analyze-link', handleAnalyzeLink);
router.post('/analyze-report', handleAnalyzeReport);
router.post('/chat', handleChat);
router.get('/history', getCheckHistory);

export default router;
