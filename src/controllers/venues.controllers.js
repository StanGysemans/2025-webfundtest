import * as venueService from '../services/venue.service.js';

export const getVenues = async (req, res) => {
  const venues = await venueService.getAll(req.query);
  res.json(venues);
};

export const createVenue = async (req, res) => {
  const venue = await venueService.create(req.user.id, req.body);
  res.status(201).json(venue);
};
