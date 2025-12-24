import * as venueSfeerbeeldService from '../services/venuesfeerbeeld.service.js';

export const getSfeerbeelden = async (req, res) => {
  try {
    const sfeerbeelden = await venueSfeerbeeldService.getAll(req.params.venueId);
    res.json(sfeerbeelden);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSfeerbeeldById = async (req, res) => {
  try {
    const sfeerbeeld = await venueSfeerbeeldService.getById(req.params.id);
    if (!sfeerbeeld) {
      return res.status(404).json({ error: 'Sfeerbeeld not found' });
    }
    res.json(sfeerbeeld);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createSfeerbeeld = async (req, res) => {
  try {
    console.log('=== CREATE VENUE SFEERBEELD ===');
    console.log('Venue ID:', req.params.venueId);
    
    const sfeerbeeld = await venueSfeerbeeldService.create(req.params.venueId, req.body);
    res.status(201).json(sfeerbeeld);
  } catch (error) {
    console.error('Error creating sfeerbeeld:', error);
    res.status(500).json({ error: error.message || 'Er is een fout opgetreden bij het aanmaken van het sfeerbeeld' });
  }
};

export const updateSfeerbeeld = async (req, res) => {
  try {
    const sfeerbeeld = await venueSfeerbeeldService.update(req.params.id, req.body);
    res.json(sfeerbeeld);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteSfeerbeeld = async (req, res) => {
  try {
    await venueSfeerbeeldService.remove(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

