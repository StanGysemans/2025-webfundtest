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

// Helper function to clean Decimal values (for Lat/Lng)
const cleanDecimal = (value) => {
  if (value === undefined || value === null || value === '') return null;
  const num = typeof value === 'string' ? parseFloat(value) : Number(value);
  if (isNaN(num)) return null;
  return num;
};

export const getAll = (venueId) => {
  return prisma.venueaddress.findMany({
    where: { VenueID: parseInt(venueId) }
  });
};

export const getById = (id) => {
  return prisma.venueaddress.findUnique({
    where: { VenueAddressID: parseInt(id) },
    include: {
      venue: true
    }
  });
};

export const create = async (venueId, data) => {
  console.log('=== VENUE ADDRESS SERVICE CREATE ===');
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
    const addressData = {
      VenueID: venueIdInt,
      Address: cleanString(data.Address),
      City: cleanString(data.City),
      PostalCode: cleanString(data.PostalCode),
      Lat: cleanDecimal(data.Lat),
      Lng: cleanDecimal(data.Lng)
    };
    
    // Remove null values to avoid issues
    Object.keys(addressData).forEach(key => {
      if (addressData[key] === null && key !== 'VenueID') {
        delete addressData[key];
      }
    });
    
    console.log('Creating address with data:', JSON.stringify(addressData, null, 2));
    
    const address = await prisma.venueaddress.create({
      data: addressData,
      include: {
        venue: true
      }
    });
    
    console.log('✅ Address created successfully:', address.VenueAddressID);
    return address;
    
  } catch (error) {
    console.error('❌ Address creation error:', error);
    throw new Error(error.message || 'Er is een fout opgetreden bij het aanmaken van het adres');
  }
};

export const update = async (id, data) => {
  try {
    const addressData = {
      Address: cleanString(data.Address),
      City: cleanString(data.City),
      PostalCode: cleanString(data.PostalCode),
      Lat: cleanDecimal(data.Lat),
      Lng: cleanDecimal(data.Lng)
    };
    
    // Remove undefined/null values
    Object.keys(addressData).forEach(key => {
      if (addressData[key] === null || addressData[key] === undefined) {
        delete addressData[key];
      }
    });
    
    return await prisma.venueaddress.update({
      where: { VenueAddressID: parseInt(id) },
      data: addressData,
      include: {
        venue: true
      }
    });
  } catch (error) {
    throw new Error(error.message || 'Er is een fout opgetreden bij het updaten van het adres');
  }
};

export const remove = (id) => {
  return prisma.venueaddress.delete({
    where: { VenueAddressID: parseInt(id) }
  });
};

