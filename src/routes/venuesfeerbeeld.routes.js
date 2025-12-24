import express from 'express';
import {
  getSfeerbeelden,
  getSfeerbeeldById,
  createSfeerbeeld,
  updateSfeerbeeld,
  deleteSfeerbeeld
} from '../controllers/venuesfeerbeeld.controllers.js';

import { auth } from '../middleware/auth.middleware.js';
import { role } from '../middleware/role.middleware.js';

const router = express.Router({ mergeParams: true });

router.get('/', getSfeerbeelden);
router.get('/:id', getSfeerbeeldById);
router.post('/', auth, role(['venue_owner', 'admin']), createSfeerbeeld);
router.put('/:id', auth, role(['venue_owner', 'admin']), updateSfeerbeeld);
router.delete('/:id', auth, role(['venue_owner', 'admin']), deleteSfeerbeeld);

export default router;

