import * as venuePingService from '../services/venueping.service.js';

export const getPings = async (req, res) => {
  try {
    const pings = await venuePingService.getAll(req.params.venueId);
    res.json(pings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRecentPings = async (req, res) => {
  try {
    const minutes = parseInt(req.query.minutes) || 30;
    const pings = await venuePingService.getRecent(req.params.venueId, minutes);
    res.json(pings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCrowdLevel = async (req, res) => {
  try {
    const minutes = parseInt(req.query.minutes) || 30;
    const crowdLevel = await venuePingService.getAggregatedCrowdLevel(req.params.venueId, minutes);
    res.json(crowdLevel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createPing = async (req, res) => {
  try {
    // Get user ID from authenticated request (set by auth middleware)
    const userId = req.user?.UserID;
    
    if (!userId) {
      return res.status(401).json({ error: 'Niet geauthenticeerd' });
    }
    
    const { percentage } = req.body;
    
    if (percentage === undefined || percentage === null) {
      return res.status(400).json({ error: 'Percentage is verplicht' });
    }
    
    const ping = await venuePingService.create(req.params.venueId, userId, percentage);
    res.status(201).json(ping);
  } catch (error) {
    console.error('Error creating ping:', error);
    
    // Check if it's a rate limit error
    if (error.message.includes('minuten')) {
      return res.status(429).json({ error: error.message });
    }
    
    res.status(500).json({ error: error.message || 'Er is een fout opgetreden bij het aanmaken van de ping' });
  }
};

export const getUserPing = async (req, res) => {
  try {
    const userId = req.user?.UserID;
    
    if (!userId) {
      return res.status(401).json({ error: 'Niet geauthenticeerd' });
    }
    
    const ping = await venuePingService.getUserRecentPing(req.params.venueId, userId);
    
    // Return null if no ping found (not an error)
    res.json(ping);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePing = async (req, res) => {
  try {
    const userId = req.user?.UserID;
    
    if (!userId) {
      return res.status(401).json({ error: 'Niet geauthenticeerd' });
    }
    
    const { percentage, pingId } = req.body;
    
    if (percentage === undefined || percentage === null) {
      return res.status(400).json({ error: 'Percentage is verplicht' });
    }
    
    if (!pingId) {
      return res.status(400).json({ error: 'Ping ID is verplicht' });
    }
    
    const ping = await venuePingService.update(req.params.venueId, userId, percentage, pingId);
    res.json(ping);
  } catch (error) {
    console.error('Error updating ping:', error);
    res.status(500).json({ error: error.message || 'Er is een fout opgetreden bij het bijwerken van de ping' });
  }
};

