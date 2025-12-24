import express from 'express';
import {
  getStatuses,
  getStatusById,
  getLatestStatus,
  createStatus,
  updateStatus,
  deleteStatus
} from '../controllers/venuestatus.controllers.js';

import { auth } from '../middleware/auth.middleware.js';
import { role } from '../middleware/role.middleware.js';

const router = express.Router({ mergeParams: true });

// All routes require authentication and venue_owner/admin role
router.use(auth);
router.use(role(['venue_owner', 'admin']));

router.get('/', getStatuses);
router.get('/latest', getLatestStatus);
router.get('/:id', getStatusById);
router.post('/', createStatus);
router.put('/:id', updateStatus);
router.delete('/:id', deleteStatus);

export default router;

