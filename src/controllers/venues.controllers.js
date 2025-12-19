import * as venueService from '../services/venues.service.js';

export const getVenues = async (req, res) => {
  try {
    const venues = await venueService.getAll(req.query);
    res.json(venues);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getVenueById = async (req, res) => {
  try {
    const venue = await venueService.getById(req.params.id);
    if (!venue) {
      return res.status(404).json({ error: 'Venue not found' });
    }
    res.json(venue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createVenue = async (req, res) => {
  try {
    const venue = await venueService.create(req.user.UserID, req.body);
    res.status(201).json(venue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateVenue = async (req, res) => {
  try {
    const venue = await venueService.update(req.params.id, req.body);
    res.json(venue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteVenue = async (req, res) => {
  try {
    await venueService.remove(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
