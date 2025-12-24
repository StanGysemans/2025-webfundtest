import prisma from '../../prisma/client.js';

// Helper function to clean string values
const cleanString = (value) => {
  if (value === undefined || value === null) return null;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed === '' ? null : trimmed;
  }
  return value;
};

export const getAll = (venueId) => {
  return prisma.venuecontact.findMany({
    where: { VenueID: parseInt(venueId) }
  });
};

export const getById = (id) => {
  return prisma.venuecontact.findUnique({
    where: { VenueContactID: parseInt(id) },
    include: {
      venue: true
    }
  });
};

export const create = async (venueId, data) => {
  console.log('=== VENUE CONTACT SERVICE CREATE ===');
  console.log('Venue ID:', venueId);
  console.log('Raw data:', JSON.stringify(data, null, 2));
  
  try {
    // Validate venueId
    if (!venueId || isNaN(parseInt(venueId))) {
      throw new Error('Invalid venue ID');
    }
    
    const venueIdInt = parseInt(venueId);
    
    // Verify venue exists
    const venue = await prisma.venue.findUnique({
      where: { VenueID: venueIdInt }
    });
    
    if (!venue) {
      throw new Error(`Venue with ID ${venueIdInt} not found`);
    }
    
    // Clean and prepare data
    const contactData = {
      VenueID: venueIdInt,
      Email: cleanString(data.Email),
      Phone: cleanString(data.Phone),
      WebsiteURL: cleanString(data.WebsiteURL)
    };
    
    // Remove null values to avoid issues
    Object.keys(contactData).forEach(key => {
      if (contactData[key] === null && key !== 'VenueID') {
        delete contactData[key];
      }
    });
    
    console.log('Creating contact with data:', JSON.stringify(contactData, null, 2));
    
    const contact = await prisma.venuecontact.create({
      data: contactData,
      include: {
        venue: true
      }
    });
    
    console.log('✅ Contact created successfully:', contact.VenueContactID);
    return contact;
    
  } catch (error) {
    console.error('❌ Contact creation error:', error);
    throw new Error(error.message || 'Er is een fout opgetreden bij het aanmaken van de contactgegevens');
  }
};

export const update = async (id, data) => {
  try {
    const contactData = {
      Email: cleanString(data.Email),
      Phone: cleanString(data.Phone),
      WebsiteURL: cleanString(data.WebsiteURL)
    };
    
    // Remove undefined/null values
    Object.keys(contactData).forEach(key => {
      if (contactData[key] === null || contactData[key] === undefined) {
        delete contactData[key];
      }
    });
    
    return await prisma.venuecontact.update({
      where: { VenueContactID: parseInt(id) },
      data: contactData,
      include: {
        venue: true
      }
    });
  } catch (error) {
    throw new Error(error.message || 'Er is een fout opgetreden bij het updaten van de contactgegevens');
  }
};

export const remove = (id) => {
  return prisma.venuecontact.delete({
    where: { VenueContactID: parseInt(id) }
  });
};

