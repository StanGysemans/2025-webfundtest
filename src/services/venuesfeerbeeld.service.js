import prisma from '../../prisma/client.js';

export const getAll = (venueId) => {
  return prisma.venuesfeerbeeld.findMany({
    where: { VenueID: parseInt(venueId) }
  });
};

export const getById = (id) => {
  return prisma.venuesfeerbeeld.findUnique({
    where: { SfeerbeeldID: parseInt(id) },
    include: {
      venue: true
    }
  });
};

export const create = async (venueId, data) => {
  console.log('=== VENUE SFEERBEELD SERVICE CREATE ===');
  console.log('Venue ID:', venueId);
  
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
    
    // Handle Foto - can be Buffer, base64 string, or binary data
    let fotoData = null;
    if (data.Foto) {
      if (Buffer.isBuffer(data.Foto)) {
        fotoData = data.Foto;
      } else if (typeof data.Foto === 'string') {
        // Assume base64, convert to buffer
        fotoData = Buffer.from(data.Foto, 'base64');
      } else {
        fotoData = data.Foto;
      }
    }
    
    const sfeerbeeldDataObj = {
      VenueID: venueIdInt,
      Foto: fotoData
    };
    
    // Remove Foto if null
    if (fotoData === null) {
      delete sfeerbeeldDataObj.Foto;
    }
    
    console.log('Creating sfeerbeeld with VenueID:', venueIdInt);
    
    const sfeerbeeld = await prisma.venuesfeerbeeld.create({
      data: sfeerbeeldDataObj,
      include: {
        venue: true
      }
    });
    
    console.log('✅ Sfeerbeeld created successfully:', sfeerbeeld.SfeerbeeldID);
    return sfeerbeeld;
    
  } catch (error) {
    console.error('❌ Sfeerbeeld creation error:', error);
    throw new Error(error.message || 'Er is een fout opgetreden bij het aanmaken van het sfeerbeeld');
  }
};

export const update = async (id, data) => {
  try {
    const fotoData = {};
    
    if (data.Foto !== undefined) {
      if (Buffer.isBuffer(data.Foto)) {
        fotoData.Foto = data.Foto;
      } else if (typeof data.Foto === 'string') {
        fotoData.Foto = Buffer.from(data.Foto, 'base64');
      } else {
        fotoData.Foto = data.Foto;
      }
    }
    
    return await prisma.venuesfeerbeeld.update({
      where: { SfeerbeeldID: parseInt(id) },
      data: fotoData,
      include: {
        venue: true
      }
    });
  } catch (error) {
    throw new Error(error.message || 'Er is een fout opgetreden bij het updaten van het sfeerbeeld');
  }
};

export const remove = (id) => {
  return prisma.venuesfeerbeeld.delete({
    where: { SfeerbeeldID: parseInt(id) }
  });
};

