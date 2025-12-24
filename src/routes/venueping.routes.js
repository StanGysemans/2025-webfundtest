import express from 'express';
import * as venuePingController from '../controllers/venueping.controllers.js';
import { auth } from '../middleware/auth.middleware.js';

const router = express.Router({ mergeParams: true });

// Get aggregated crowd level (no auth required - public info)
router.get('/crowd-level', venuePingController.getCrowdLevel);

// All other routes require authentication
router.use(auth);

// Get all pings for a venue
router.get('/', venuePingController.getPings);

// Get recent pings for a venue (last 30 minutes by default)
router.get('/recent', venuePingController.getRecentPings);

// Create a new ping (requires authentication)
router.post('/', venuePingController.createPing);

// Update an existing ping (requires authentication)
router.put('/', venuePingController.updatePing);

// Get user's recent ping for a venue
router.get('/me', venuePingController.getUserPing);

export default router;

