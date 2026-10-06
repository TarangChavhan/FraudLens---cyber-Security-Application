import { Router } from 'express';
import { checkLink, getLinkHistory } from '../controllers/linkController.js';

const router = Router();

router.post('/check', checkLink);
router.get('/history', getLinkHistory);

export default router;
