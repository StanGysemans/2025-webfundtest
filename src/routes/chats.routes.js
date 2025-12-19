import express from 'express';
import {
  getChats,
  getChatById,
  createChat,
  getMessages,
  createMessage,
} from '../controllers/chats.controllers.js';
import { auth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', auth, getChats);
router.get('/:id', auth, getChatById);
router.post('/', auth, createChat);
router.get('/:id/messages', auth, getMessages);
router.post('/:id/messages', auth, createMessage);

export default router;

