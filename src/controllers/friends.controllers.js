import * as friendService from '../services/friends.service.js';

export const getFriends = async (req, res) => {
  try {
    const friends = await friendService.getAll(req.user.UserID);
    res.json(friends);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFriendById = async (req, res) => {
  try {
    const friend = await friendService.getById(req.params.id);
    if (!friend) {
      return res.status(404).json({ error: 'Friend relationship not found' });
    }
    res.json(friend);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createFriendRequest = async (req, res) => {
  try {
    const { UserID2 } = req.body;
    if (!UserID2) {
      return res.status(400).json({ error: 'UserID2 is required' });
    }
    const friend = await friendService.create(
      req.user.UserID,
      UserID2,
      req.user.UserID
    );
    res.status(201).json(friend);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const friend = await friendService.accept(req.params.id);
    res.json(friend);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const blockFriend = async (req, res) => {
  try {
    const friend = await friendService.block(req.params.id);
    res.json(friend);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteFriend = async (req, res) => {
  try {
    await friendService.remove(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPendingRequests = async (req, res) => {
  try {
    console.log('Getting pending requests for user:', req.user.UserID);
    const requests = await friendService.getPendingRequests(req.user.UserID);
    res.json(requests);
  } catch (error) {
    console.error('Error getting pending requests:', error);
    res.status(500).json({ error: error.message || 'Er is een fout opgetreden bij het ophalen van vriend verzoeken' });
  }
};

