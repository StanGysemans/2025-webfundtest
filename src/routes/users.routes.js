import express from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateLocationPreference,
  getLocationPreference,
  deleteOwnAccount
} from '../controllers/users.controllers.js';
import { auth } from '../middleware/auth.middleware.js';
import { role } from '../middleware/role.middleware.js';

const router = express.Router();

// IMPORTANT: Specific routes (like /me) must come BEFORE parameterized routes (like /:id)
// Otherwise Express will match /me as /:id with id="me"

// Test route to verify routing works
router.get('/me/test', auth, (req, res) => {
  console.log('Test route /users/me/test called');
  res.json({ message: 'Route /me works!', user: req.user });
});

// Delete own account (specific route) - MUST be first DELETE route
router.delete('/me', (req, res, next) => {
  console.log('=== DELETE /users/me route matched ===');
  console.log('Request method:', req.method);
  console.log('Request path:', req.path);
  console.log('Request originalUrl:', req.originalUrl);
  console.log('Request baseUrl:', req.baseUrl);
  next();
}, auth, (req, res, next) => {
  console.log('Auth middleware passed');
  console.log('User from token:', req.user);
  if (!req.user || !req.user.UserID) {
    console.error('No user or UserID in request');
    return res.status(401).json({ error: 'Invalid token' });
  }
  next();
}, deleteOwnAccount);

// Location preferences (specific routes)
router.get('/me/location-preference', auth, getLocationPreference);
router.put('/me/location-preference', auth, updateLocationPreference);

// General routes
router.get('/', auth, getUsers);
router.post('/', createUser);

// Parameterized routes (must come after specific routes)
// Add check to prevent /me from being matched as /:id
router.get('/:id', auth, (req, res, next) => {
  if (req.params.id === 'me') {
    return res.status(404).json({ error: 'Use /me/location-preference for location preferences' });
  }
  next();
}, getUserById);

router.put('/:id', auth, (req, res, next) => {
  if (req.params.id === 'me') {
    return res.status(404).json({ error: 'Use /me/location-preference for location preferences' });
  }
  next();
}, updateUser);

router.delete('/:id', auth, (req, res, next) => {
  if (req.params.id === 'me') {
    console.error('ERROR: /me was matched by /:id route! This should not happen.');
    return res.status(403).json({ error: 'Route conflict: /me should be handled by specific route' });
  }
  next();
}, role(['admin']), deleteUser);

export default router;

