import * as venueContactService from '../services/venuecontact.service.js';

export const getContacts = async (req, res) => {
  try {
    const contacts = await venueContactService.getAll(req.params.venueId);
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getContactById = async (req, res) => {
  try {
    const contact = await venueContactService.getById(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createContact = async (req, res) => {
  try {
    console.log('=== CREATE VENUE CONTACT ===');
    console.log('Venue ID:', req.params.venueId);
    console.log('Body:', JSON.stringify(req.body, null, 2));
    
    const contact = await venueContactService.create(req.params.venueId, req.body);
    res.status(201).json(contact);
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ error: error.message || 'Er is een fout opgetreden bij het aanmaken van de contactgegevens' });
  }
};

export const updateContact = async (req, res) => {
  try {
    const contact = await venueContactService.update(req.params.id, req.body);
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteContact = async (req, res) => {
  try {
    await venueContactService.remove(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

