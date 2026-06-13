import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  getHistory,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/history', protect, getHistory);

export default router;
