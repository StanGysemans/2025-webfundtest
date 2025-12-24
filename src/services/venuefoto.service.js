import prisma from '../../prisma/client.js';

export const getAll = (venueId) => {
  return prisma.venuefoto.findMany({
    where: { VenueID: parseInt(venueId) }
  });
};

export const getById = (id) => {
  return prisma.venuefoto.findUnique({
    where: { VenueFotoID: parseInt(id) },
    include: {
      venue: true
    }
  });
};

export const create = async (venueId, data) => {
  console.log('=== VENUE FOTO SERVICE CREATE ===');
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
    
    const fotoDataObj = {
      VenueID: venueIdInt,
      Foto: fotoData
    };
    
    // Remove Foto if null
    if (fotoData === null) {
      delete fotoDataObj.Foto;
    }
    
    // Handle IsHoofdFoto
    if (data.IsHoofdFoto !== undefined) {
      fotoDataObj.IsHoofdFoto = data.IsHoofdFoto;
    }
    
    console.log('Creating foto with VenueID:', venueIdInt);
    
    const foto = await prisma.venuefoto.create({
      data: fotoDataObj,
      include: {
        venue: true
      }
    });
    
    console.log('✅ Foto created successfully:', foto.VenueFotoID);
    return foto;
    
  } catch (error) {
    console.error('❌ Foto creation error:', error);
    throw new Error(error.message || 'Er is een fout opgetreden bij het aanmaken van de foto');
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
    
    // Handle IsHoofdFoto
    if (data.IsHoofdFoto !== undefined) {
      fotoData.IsHoofdFoto = data.IsHoofdFoto;
    }
    
    return await prisma.venuefoto.update({
      where: { VenueFotoID: parseInt(id) },
      data: fotoData,
      include: {
        venue: true
      }
    });
  } catch (error) {
    throw new Error(error.message || 'Er is een fout opgetreden bij het updaten van de foto');
  }
};

export const remove = (id) => {
  return prisma.venuefoto.delete({
    where: { VenueFotoID: parseInt(id) }
  });
};

