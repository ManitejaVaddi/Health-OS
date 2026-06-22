import express from 'express';

import {
  createFeedback,
  getFeedbacks,
  markFeedbackReviewed,
   getMyFeedbacks,
} from '../controllers/feedbackController.js';

import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

// User submits feedback
router.post(
  '/',
  protect,
  createFeedback
);

// Admin views all feedback
router.get(
  '/',
  protect,
  adminOnly,
  getFeedbacks
);

// Admin marks feedback as reviewed
router.put(
  '/:id/review',
  protect,
  adminOnly,
  markFeedbackReviewed
);

router.get(
  '/my-feedbacks',
  protect,
  getMyFeedbacks
);

export default router;