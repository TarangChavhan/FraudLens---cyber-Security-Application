import express from 'express';
import { getGuidelines, createGuideline } from '../controllers/guidelineController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(getGuidelines).post(protect, admin, createGuideline);

export default router;
