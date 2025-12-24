import express from 'express';
import {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact
} from '../controllers/venuecontact.controllers.js';

import { auth } from '../middleware/auth.middleware.js';
import { role } from '../middleware/role.middleware.js';

const router = express.Router({ mergeParams: true });

// All routes require authentication and venue_owner/admin role
router.use(auth);
router.use(role(['venue_owner', 'admin']));

router.get('/', getContacts);
router.get('/:id', getContactById);
router.post('/', createContact);
router.put('/:id', updateContact);
router.delete('/:id', deleteContact);

export default router;

