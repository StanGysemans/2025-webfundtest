import express from 'express';
import {
  createRoleRequest,
  getRoleRequests,
  getRoleRequestById,
  updateRoleRequestStatus,
  deleteRoleRequest
} from '../controllers/rolerequests.controllers.js';
import { auth } from '../middleware/auth.middleware.js';
import { role } from '../middleware/role.middleware.js';

const router = express.Router();

// Create role request (auth required)
router.post('/', auth, createRoleRequest);

// Get all role requests (auth required, admin only for all, users can see their own)
router.get('/', auth, getRoleRequests);

// Get role request by ID (auth required)
router.get('/:id', auth, getRoleRequestById);

// Update role request status (auth + admin role required)
router.put('/:id/status', auth, role(['admin']), updateRoleRequestStatus);

// Delete role request (auth required, users can delete their own)
router.delete('/:id', auth, deleteRoleRequest);

export default router;

