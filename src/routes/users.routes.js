import express from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateLocationPreference,
  getLocationPreference
} from '../controllers/users.controllers.js';
import { auth } from '../middleware/auth.middleware.js';
import { role } from '../middleware/role.middleware.js';

const router = express.Router();

router.get('/', auth, getUsers);
router.get('/:id', auth, getUserById);
router.post('/', createUser);
router.put('/:id', auth, updateUser);
router.delete('/:id', auth, role(['admin']), deleteUser);

// Location preferences
router.get('/me/location-preference', auth, getLocationPreference);
router.put('/me/location-preference', auth, updateLocationPreference);

export default router;

