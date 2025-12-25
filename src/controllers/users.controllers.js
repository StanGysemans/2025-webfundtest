import * as userService from '../services/users.service.js';

export const getUsers = async (req, res) => {
  try {
    const users = await userService.getAll(req.query);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await userService.getById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const user = await userService.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await userService.update(req.params.id, req.body);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await userService.remove(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateLocationPreference = async (req, res) => {
  try {
    const userId = req.user.UserID;
    const preference = await userService.updateLocationPreference(userId, req.body);
    res.json(preference);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getLocationPreference = async (req, res) => {
  try {
    const userId = req.user.UserID;
    const preference = await userService.getLocationPreference(userId);
    if (!preference) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(preference);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteOwnAccount = async (req, res) => {
  try {
    console.log('deleteOwnAccount controller called');
    console.log('Request user:', req.user);
    console.log('Request method:', req.method);
    console.log('Request path:', req.path);
    console.log('Request originalUrl:', req.originalUrl);
    
    const userId = req.user?.UserID; // From JWT token
    
    if (!userId) {
      console.error('No UserID in token');
      return res.status(401).json({ error: 'Invalid token: No UserID found' });
    }
    
    console.log('Deleting account for user ID:', userId);
    
    // Verify user exists
    const user = await userService.getById(userId);
    if (!user) {
      console.error('User not found:', userId);
      return res.status(404).json({ error: 'User not found' });
    }
    
    console.log('User found, proceeding with deletion...');
    
    // Delete account and all related data
    await userService.deleteOwnAccount(userId);
    
    console.log('Account successfully deleted');
    res.status(200).json({ message: 'Account successfully deleted' });
  } catch (error) {
    console.error('Error deleting account:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: error.message || 'Failed to delete account' });
  }
};

