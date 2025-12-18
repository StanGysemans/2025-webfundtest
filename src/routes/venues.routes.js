import express from 'express';
import {getVenues, getVenueById, createVenue, updateVenue, deleteVenue} from '../controllers/venues.controller.js';

import { auth } from '../middleware/auth.middleware.js';
import { role } from '../middleware/role.middleware.js';

const router = express.Router();

router.get('/', getVenues);
router.get('/:id', getVenueById);

router.post('/', auth, role(['venue_owner']), createVenue);
router.put('/:id', auth, role(['venue_owner']), updateVenue);
router.delete('/:id', auth, role(['venue_owner']), deleteVenue);

export default router;
