import express from 'express';
import {getVenues, getVenueById, createVenue, updateVenue, deleteVenue, testCreateVenue} from '../controllers/venues.controllers.js';

import { auth } from '../middleware/auth.middleware.js';
import { role } from '../middleware/role.middleware.js';

const router = express.Router();

router.get('/', getVenues);
router.get('/:id', getVenueById);

// Test endpoint (only in development)
if (process.env.NODE_ENV === 'development') {
  router.post('/test/create', testCreateVenue);
}

router.post('/', auth, role(['venue_owner', 'admin']), createVenue);
router.put('/:id', auth, role(['venue_owner', 'admin']), updateVenue);
router.delete('/:id', auth, role(['venue_owner', 'admin']), deleteVenue);

export default router;
