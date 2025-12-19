import express from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/users.controllers.js';
import { auth } from '../middleware/auth.middleware.js';
import { role } from '../middleware/role.middleware.js';

const router = express.Router();

router.get('/', auth, getUsers);
router.get('/:id', auth, getUserById);
router.post('/', createUser);
router.put('/:id', auth, updateUser);
router.delete('/:id', auth, role(['admin']), deleteUser);

export default router;

