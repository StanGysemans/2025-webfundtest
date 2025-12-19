import * as chatService from '../services/chats.service.js';
import prisma from '../../prisma/client.js';



export const getChats = async (req, res) => {
  try {
    const chats = await chatService.getAll(req.user.UserID);
    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getChatById = async (req, res) => {
  try {
    const chat = await chatService.getById(req.params.id, req.user.UserID);
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }
    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createChat = async (req, res) => {
  try {
    console.log('HEADERS:', req.headers['content-type']);
    console.log('BODY:', req.body);

    const { UserID2 } = req.body;
    if (!UserID2) {
      return res.status(400).json({ error: 'UserID2 is required' });
    }
    const chat = await chatService.create(req.user.UserID, UserID2);
    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await chatService.getMessages(req.params.id);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createMessage = async (req, res) => {
  try {
    const { MessageText } = req.body;
    if (!MessageText) {
      return res.status(400).json({ error: 'MessageText is required' });
    }
    const message = await chatService.createMessage(
      req.params.id,
      req.user.UserID,
      MessageText
    );
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


