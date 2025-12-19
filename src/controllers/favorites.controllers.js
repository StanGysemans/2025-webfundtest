import * as favoriteService from '../services/favorites.service.js';

export const getFavorites = async (req, res) => {
  try {
    const favorites = await favoriteService.getAll(req.user.UserID);
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFavoriteById = async (req, res) => {
  try {
    const favorite = await favoriteService.getById(req.params.id);
    if (!favorite) {
      return res.status(404).json({ error: 'Favorite not found' });
    }
    res.json(favorite);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createFavorite = async (req, res) => {
  try {
    const { VenueID } = req.body;
    if (!VenueID) {
      return res.status(400).json({ error: 'VenueID is required' });
    }
    const favorite = await favoriteService.create(req.user.UserID, VenueID);
    res.status(201).json(favorite);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteFavorite = async (req, res) => {
  try {
    await favoriteService.remove(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteFavoriteByVenue = async (req, res) => {
  try {
    const VenueID = req.params.venueId;
    if (!VenueID) {
      return res.status(400).json({ error: 'VenueID is required' });
    }
    await favoriteService.removeByVenue(req.user.UserID, VenueID);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

