import prisma from '../../prisma/client.js';//enkel prisma in services folder

export const getAll = (filters = {}) => {
  return prisma.venue.findMany({
    where: filters.search ? {
      Name: { contains: filters.search }
    } : {},
    include: {
      venueaddress: true,
      venuecontact: true,
      venuefoto: true,
      venuesfeerbeeld: true,
      venuetype: true,
      venuestatus: {
        orderBy: { TimeStamp: 'desc' },
        take: 1
      }
    }
  });
};

export const getById = (id) => {
  return prisma.venue.findUnique({
    where: { VenueID: parseInt(id) },
    include: {
      venueaddress: true,
      venuecontact: true,
      venuefoto: true,
      venuesfeerbeeld: true,
      venuetype: true,
      venuestatus: {
        orderBy: { TimeStamp: 'desc' },
        take: 1
      },
      favorite: true,
      feedback: true
    }
  });
};

// Helper function to clean string values (convert empty strings to null)
const cleanString = (value) => {
  if (value === undefined || value === null) return null;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed === '' ? null : trimmed;
  }
  return value;
};

// Helper function to clean number values
const cleanNumber = (value) => {
  if (value === undefined || value === null || value === '') return null;
  const num = typeof value === 'string' ? parseFloat(value) : Number(value);
  return isNaN(num) ? null : num;
};

// Helper function to clean Decimal values (for Lat/Lng)
const cleanDecimal = (value) => {
  if (value === undefined || value === null || value === '') return null;
  const num = typeof value === 'string' ? parseFloat(value) : Number(value);
  if (isNaN(num)) return null;
  // Return as number, Prisma will handle Decimal conversion
  return num;
};

export const create = async (ownerId, data) => {
  console.log('=== VENUE SERVICE CREATE (BASE ONLY) ===');
  console.log('Owner ID:', ownerId);
  console.log('Raw data received:', JSON.stringify(data, null, 2));
  
  try {
    // Validate ownerId
    if (!ownerId || isNaN(parseInt(ownerId))) {
      throw new Error('Invalid owner ID');
    }
    
    const ownerIdInt = parseInt(ownerId);
    console.log('Parsed owner ID:', ownerIdInt);
    
    // Extract only base venue data (no nested relations)
    const { VenueType, OpeningHours, Name, Description, MaxCap, AveragePrice } = data;
    
    console.log('Extracted fields:');
    console.log('  Name:', Name);
    console.log('  VenueType:', VenueType);
    console.log('  OpeningHours:', OpeningHours ? JSON.stringify(OpeningHours, null, 2) : 'null');
    
    // Validate required field
    if (!Name || typeof Name !== 'string' || Name.trim().length === 0) {
      throw new Error('Venue naam is verplicht');
    }
    
    const venueName = Name.trim();
    
    // Check if venue with same name already exists for this owner
    const existingVenue = await prisma.venue.findFirst({
      where: {
        Name: venueName,
        OwnerID: ownerIdInt
      }
    });
    
    if (existingVenue) {
      throw new Error(`Er bestaat al een venue met de naam "${venueName}"`);
    }
    
    // Find or create venue type
    let venueTypeId = null;
    if (VenueType && typeof VenueType === 'string' && VenueType.trim().length > 0) {
      const venueTypeName = VenueType.trim();
      let venueType = await prisma.venuetype.findFirst({
        where: { VenueType: venueTypeName }
      });
      
      if (!venueType) {
        venueType = await prisma.venuetype.create({
          data: { VenueType: venueTypeName }
        });
      }
      
      venueTypeId = venueType.VenueTypeID;
    }
    
    // Build base venue data - ONLY base fields, no nested relations
    const venueBaseData = {
      Name: venueName,
      Description: cleanString(Description),
      MaxCap: cleanNumber(MaxCap),
      AveragePrice: cleanString(AveragePrice),
      OwnerID: ownerIdInt,
      VenueTypeID: venueTypeId
    };
    
    // Handle OpeningHours - must be valid JSON object or null
    if (OpeningHours) {
      if (typeof OpeningHours === 'object' && OpeningHours !== null && !Array.isArray(OpeningHours)) {
        // Already a valid object
        venueBaseData.OpeningHours = OpeningHours;
      } else if (typeof OpeningHours === 'string' && OpeningHours.trim().length > 0) {
        try {
          const parsed = JSON.parse(OpeningHours.trim());
          if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
            venueBaseData.OpeningHours = parsed;
          }
        } catch (e) {
          console.warn('Invalid OpeningHours JSON format, skipping:', OpeningHours);
          // Don't throw error, just skip OpeningHours
        }
      }
    }
    
    console.log('=== FINAL PRISMA DATA (BASE VENUE ONLY) ===');
    console.log(JSON.stringify(venueBaseData, null, 2));
    
    // Validate Prisma data structure before creating
    if (!venueBaseData.Name || venueBaseData.Name.trim().length === 0) {
      throw new Error('Venue naam is verplicht en mag niet leeg zijn');
    }
    
    if (!venueBaseData.OwnerID || isNaN(venueBaseData.OwnerID)) {
      throw new Error('Owner ID is verplicht en moet een geldig nummer zijn');
    }
    
    console.log('Creating base venue with Prisma...');
    
    // Create ONLY the base venue (no nested relations)
    const createdVenue = await prisma.venue.create({
      data: venueBaseData,
      include: {
        venuetype: true
      }
    });
    
    console.log('✅ Base venue created successfully!');
    console.log('Venue ID:', createdVenue.VenueID);
    console.log('Venue Name:', createdVenue.Name);
    console.log('⚠️  Note: Address, Contact, Foto, and Status must be created separately using their respective endpoints');
    
    return createdVenue;
    
  } catch (error) {
    // Handle Prisma unique constraint errors
    if (error.code === 'P2002') {
      throw new Error(`Er bestaat al een venue met deze naam`);
    }
    
    // Log detailed error information
    console.error('Venue creation error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    if (error.meta) {
      console.error('Prisma error meta:', JSON.stringify(error.meta, null, 2));
    }
    if (error.cause) {
      console.error('Error cause:', error.cause);
    }
    
    // Re-throw with user-friendly message
    throw new Error(error.message || 'Er is een fout opgetreden bij het aanmaken van het venue');
  }
};

export const update = async (id, data) => {
  const { VenueType, venueaddress, venuecontact, ...venueData } = data;
  
  // Handle venue type update
  let venueTypeId = null;
  if (VenueType) {
    let venueType = await prisma.venuetype.findFirst({
      where: { VenueType: VenueType }
    });
    
    if (!venueType) {
      venueType = await prisma.venuetype.create({
        data: { VenueType: VenueType }
      });
    }
    
    venueTypeId = venueType.VenueTypeID;
    venueData.VenueTypeID = venueTypeId;
  }
  
  // Update venue
  const updatedVenue = await prisma.venue.update({
    where: { VenueID: parseInt(id) },
    data: venueData,
    include: {
      venueaddress: true,
      venuecontact: true,
      venuetype: true
    }
  });
  
  // Update or create address
  if (venueaddress && venueaddress.create) {
    const existingAddress = updatedVenue.venueaddress?.[0];
    if (existingAddress) {
      await prisma.venueaddress.update({
        where: { VenueAddressID: existingAddress.VenueAddressID },
        data: {
          Address: venueaddress.create.Address || null,
          City: venueaddress.create.City || null,
          PostalCode: venueaddress.create.PostalCode || null,
          Lat: venueaddress.create.Lat || null,
          Lng: venueaddress.create.Lng || null
        }
      });
    } else {
      await prisma.venueaddress.create({
        data: {
          VenueID: parseInt(id),
          Address: venueaddress.create.Address || null,
          City: venueaddress.create.City || null,
          PostalCode: venueaddress.create.PostalCode || null,
          Lat: venueaddress.create.Lat || null,
          Lng: venueaddress.create.Lng || null
        }
      });
    }
  }
  
  // Update or create contact
  if (venuecontact && venuecontact.create) {
    const existingContact = updatedVenue.venuecontact?.[0];
    if (existingContact) {
      await prisma.venuecontact.update({
        where: { VenueContactID: existingContact.VenueContactID },
        data: {
          Email: venuecontact.create.Email || null,
          Phone: venuecontact.create.Phone || null,
          WebsiteURL: venuecontact.create.WebsiteURL || null
        }
      });
    } else {
      await prisma.venuecontact.create({
        data: {
          VenueID: parseInt(id),
          Email: venuecontact.create.Email || null,
          Phone: venuecontact.create.Phone || null,
          WebsiteURL: venuecontact.create.WebsiteURL || null
        }
      });
    }
  }
  
  // Return updated venue with all relations
  return await prisma.venue.findUnique({
    where: { VenueID: parseInt(id) },
    include: {
      venueaddress: true,
      venuecontact: true,
      venuetype: true
    }
  });
};

export const remove = async (id) => {
  const venueId = parseInt(id);
  
  // Delete all related records first (cascade delete manually)
  // Order matters due to foreign key constraints
  
  // 1. Delete venuefoto
  await prisma.venuefoto.deleteMany({
    where: { VenueID: venueId }
  });
  
  // 2. Delete venuestatus
  await prisma.venuestatus.deleteMany({
    where: { VenueID: venueId }
  });
  
  // 3. Delete feedback
  await prisma.feedback.deleteMany({
    where: { VenueID: venueId }
  });
  
  // 4. Delete favorites
  await prisma.favorite.deleteMany({
    where: { VenueID: venueId }
  });
  
  // 5. Delete venuecontact
  await prisma.venuecontact.deleteMany({
    where: { VenueID: venueId }
  });
  
  // 6. Delete venueaddress
  await prisma.venueaddress.deleteMany({
    where: { VenueID: venueId }
  });
  
  // 7. Finally delete the venue itself
  return prisma.venue.delete({
    where: { VenueID: venueId }
  });
};

