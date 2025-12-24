import * as venueAddressService from '../services/venueaddress.service.js';

export const getAddresses = async (req, res) => {
  try {
    const addresses = await venueAddressService.getAll(req.params.venueId);
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAddressById = async (req, res) => {
  try {
    const address = await venueAddressService.getById(req.params.id);
    if (!address) {
      return res.status(404).json({ error: 'Address not found' });
    }
    res.json(address);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createAddress = async (req, res) => {
  try {
    console.log('=== CREATE VENUE ADDRESS ===');
    console.log('Venue ID:', req.params.venueId);
    console.log('Body:', JSON.stringify(req.body, null, 2));
    
    const address = await venueAddressService.create(req.params.venueId, req.body);
    res.status(201).json(address);
  } catch (error) {
    console.error('Error creating address:', error);
    res.status(500).json({ error: error.message || 'Er is een fout opgetreden bij het aanmaken van het adres' });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const address = await venueAddressService.update(req.params.id, req.body);
    res.json(address);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    await venueAddressService.remove(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

