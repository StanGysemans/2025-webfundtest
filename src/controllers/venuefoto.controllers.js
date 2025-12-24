import * as venueFotoService from '../services/venuefoto.service.js';

export const getFotos = async (req, res) => {
  try {
    const fotos = await venueFotoService.getAll(req.params.venueId);
    res.json(fotos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFotoById = async (req, res) => {
  try {
    const foto = await venueFotoService.getById(req.params.id);
    if (!foto) {
      return res.status(404).json({ error: 'Foto not found' });
    }
    res.json(foto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createFoto = async (req, res) => {
  try {
    console.log('=== CREATE VENUE FOTO ===');
    console.log('Venue ID:', req.params.venueId);
    
    const foto = await venueFotoService.create(req.params.venueId, req.body);
    res.status(201).json(foto);
  } catch (error) {
    console.error('Error creating foto:', error);
    res.status(500).json({ error: error.message || 'Er is een fout opgetreden bij het aanmaken van de foto' });
  }
};

export const updateFoto = async (req, res) => {
  try {
    const foto = await venueFotoService.update(req.params.id, req.body);
    res.json(foto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteFoto = async (req, res) => {
  try {
    await venueFotoService.remove(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

