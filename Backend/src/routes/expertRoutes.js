import express from 'express';
import { getExpertCases, updateInvestigation } from '../controllers/expertController.js';

const router = express.Router();

router.get('/cases', getExpertCases);
router.post('/investigation/:id', updateInvestigation);
router.patch('/investigation/:id', updateInvestigation);

export default router;
