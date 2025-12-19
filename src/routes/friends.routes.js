import express from 'express';
import {
  getFriends,
  getFriendById,
  createFriendRequest,
  acceptFriendRequest,
  blockFriend,
  deleteFriend,
  getPendingRequests
} from '../controllers/friends.controllers.js';
import { auth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', auth, getFriends);
router.get('/pending', auth, getPendingRequests);
router.get('/:id', auth, getFriendById);
router.post('/', auth, createFriendRequest);
router.put('/:id/accept', auth, acceptFriendRequest);
router.put('/:id/block', auth, blockFriend);
router.delete('/:id', auth, deleteFriend);

export default router;

