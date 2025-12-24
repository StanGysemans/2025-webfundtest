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
    console.log('=== VENUE CREATION REQUEST ===');
    console.log('User ID:', req.user.UserID);
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    // Log each part of the data
    if (req.body.Name) console.log('Name:', req.body.Name);
    if (req.body.Description) console.log('Description:', req.body.Description);
    if (req.body.VenueType) console.log('VenueType:', req.body.VenueType);
    if (req.body.OpeningHours) console.log('OpeningHours:', JSON.stringify(req.body.OpeningHours, null, 2));
    if (req.body.venueaddress) console.log('venueaddress:', JSON.stringify(req.body.venueaddress, null, 2));
    if (req.body.venuecontact) console.log('venuecontact:', JSON.stringify(req.body.venuecontact, null, 2));
    
    const venue = await venueService.create(req.user.UserID, req.body);
    
    console.log('✅ Venue created successfully:', venue.VenueID);
    res.status(201).json(venue);
  } catch (error) {
    console.error('❌ Error creating venue:');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    if (error.meta) {
      console.error('Prisma meta:', JSON.stringify(error.meta, null, 2));
    }
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
    res.status(500).json({ 
      error: error.message || 'Er is een fout opgetreden bij het aanmaken van het venue',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
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

// Test endpoint to create a venue with example data (development only)
export const testCreateVenue = async (req, res) => {
  try {
    console.log('=== TEST VENUE CREATION ===');
    
    // Example data that should work
    const exampleData = {
      Name: 'Test Bar Example',
      Description: 'Een test bar voor debugging',
      MaxCap: 100,
      AveragePrice: '€10-€20',
      VenueType: 'Bar',
      OpeningHours: {
        maandag: '09:00-21:00',
        dinsdag: '09:00-21:00',
        woensdag: '09:00-20:00',
        donderdag: '09:00-21:00',
        vrijdag: '09:00-21:00',
        zaterdag: '13:00-22:00',
        zondag: '13:00-20:00'
      },
      venueaddress: {
        create: {
          Address: 'Kerkstraat 123',
          City: 'Amsterdam',
          PostalCode: '1017 AB',
          Lat: 52.3676,
          Lng: 4.9041
        }
      },
      venuecontact: {
        create: {
          Email: 'test@example.nl',
          Phone: '+31 20 1234567',
          WebsiteURL: 'https://example.nl'
        }
      }
    };
    
    console.log('Example data:', JSON.stringify(exampleData, null, 2));
    
    // Use owner ID 1 for testing (or from request if provided)
    const ownerId = req.body.ownerId || 1;
    
    const venue = await venueService.create(ownerId, exampleData);
    
    res.status(201).json({
      success: true,
      message: 'Test venue created successfully',
      venue: venue
    });
  } catch (error) {
    console.error('Test venue creation error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
