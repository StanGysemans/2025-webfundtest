import express from 'express';
import {
  getFeedback,
  getFeedbackById,
  createFeedback,
  updateFeedback,
  deleteFeedback
} from '../controllers/feedback.controllers.js';
import { auth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getFeedback);
router.get('/:id', getFeedbackById);
router.post('/', auth, createFeedback);
router.put('/:id', auth, updateFeedback);
router.delete('/:id', auth, deleteFeedback);

export default router;

