import * as venueStatusService from '../services/venuestatus.service.js';

export const getStatuses = async (req, res) => {
  try {
    const statuses = await venueStatusService.getAll(req.params.venueId);
    res.json(statuses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getStatusById = async (req, res) => {
  try {
    const status = await venueStatusService.getById(req.params.id);
    if (!status) {
      return res.status(404).json({ error: 'Status not found' });
    }
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getLatestStatus = async (req, res) => {
  try {
    const status = await venueStatusService.getLatest(req.params.venueId);
    if (!status) {
      return res.status(404).json({ error: 'No status found' });
    }
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createStatus = async (req, res) => {
  try {
    console.log('=== CREATE VENUE STATUS ===');
    console.log('Venue ID:', req.params.venueId);
    console.log('Body:', JSON.stringify(req.body, null, 2));
    
    const status = await venueStatusService.create(req.params.venueId, req.body);
    res.status(201).json(status);
  } catch (error) {
    console.error('Error creating status:', error);
    res.status(500).json({ error: error.message || 'Er is een fout opgetreden bij het aanmaken van de status' });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const status = await venueStatusService.update(req.params.id, req.body);
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteStatus = async (req, res) => {
  try {
    await venueStatusService.remove(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

