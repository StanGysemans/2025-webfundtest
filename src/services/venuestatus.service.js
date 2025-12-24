import prisma from '../../prisma/client.js';

// Helper function to clean number values
const cleanNumber = (value) => {
  if (value === undefined || value === null || value === '') return null;
  const num = typeof value === 'string' ? parseInt(value) : Number(value);
  return isNaN(num) ? null : num;
};

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
  return prisma.venuestatus.findMany({
    where: { VenueID: parseInt(venueId) },
    orderBy: { TimeStamp: 'desc' }
  });
};

export const getById = (id) => {
  return prisma.venuestatus.findUnique({
    where: { StatusID: parseInt(id) },
    include: {
      venue: true
    }
  });
};

export const getLatest = (venueId) => {
  return prisma.venuestatus.findFirst({
    where: { VenueID: parseInt(venueId) },
    orderBy: { TimeStamp: 'desc' }
  });
};

export const create = async (venueId, data) => {
  console.log('=== VENUE STATUS SERVICE CREATE ===');
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
    const statusData = {
      VenueID: venueIdInt,
      TimeStamp: data.TimeStamp ? new Date(data.TimeStamp) : new Date(),
      CrowdLevel: cleanString(data.CrowdLevel),
      UserCountEstimate: cleanNumber(data.UserCountEstimate),
      IsOpen: data.IsOpen !== undefined ? Boolean(data.IsOpen) : null
    };
    
    // Remove null values (except required fields)
    Object.keys(statusData).forEach(key => {
      if (statusData[key] === null && key !== 'VenueID' && key !== 'TimeStamp') {
        delete statusData[key];
      }
    });
    
    console.log('Creating status with data:', JSON.stringify(statusData, null, 2));
    
    const status = await prisma.venuestatus.create({
      data: statusData,
      include: {
        venue: true
      }
    });
    
    console.log('✅ Status created successfully:', status.StatusID);
    return status;
    
  } catch (error) {
    console.error('❌ Status creation error:', error);
    throw new Error(error.message || 'Er is een fout opgetreden bij het aanmaken van de status');
  }
};

export const update = async (id, data) => {
  try {
    const statusData = {};
    
    if (data.TimeStamp !== undefined) {
      statusData.TimeStamp = new Date(data.TimeStamp);
    }
    if (data.CrowdLevel !== undefined) {
      statusData.CrowdLevel = cleanString(data.CrowdLevel);
    }
    if (data.UserCountEstimate !== undefined) {
      statusData.UserCountEstimate = cleanNumber(data.UserCountEstimate);
    }
    if (data.IsOpen !== undefined) {
      statusData.IsOpen = Boolean(data.IsOpen);
    }
    
    // Remove null values
    Object.keys(statusData).forEach(key => {
      if (statusData[key] === null) {
        delete statusData[key];
      }
    });
    
    return await prisma.venuestatus.update({
      where: { StatusID: parseInt(id) },
      data: statusData,
      include: {
        venue: true
      }
    });
  } catch (error) {
    throw new Error(error.message || 'Er is een fout opgetreden bij het updaten van de status');
  }
};

export const remove = (id) => {
  return prisma.venuestatus.delete({
    where: { StatusID: parseInt(id) }
  });
};

