import express from 'express';
import {
  getFotos,
  getFotoById,
  createFoto,
  updateFoto,
  deleteFoto
} from '../controllers/venuefoto.controllers.js';

import { auth } from '../middleware/auth.middleware.js';
import { role } from '../middleware/role.middleware.js';

const router = express.Router({ mergeParams: true });

// All routes require authentication and venue_owner/admin role
router.use(auth);
router.use(role(['venue_owner', 'admin']));

router.get('/', getFotos);
router.get('/:id', getFotoById);
router.post('/', createFoto);
router.put('/:id', updateFoto);
router.delete('/:id', deleteFoto);

export default router;

