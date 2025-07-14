import express from 'express';
import { getAdminSummary } from '../controllers/adminController.js';
import { protect } from '../middlewares/authMiddleware.js';
import isAdmin from '../middlewares/isAdmin.js';

const router = express.Router();

router.get('/summary', protect, isAdmin, getAdminSummary);

export default router; 