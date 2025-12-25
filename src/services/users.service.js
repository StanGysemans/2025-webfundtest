import prisma from '../../prisma/client.js';
import bcrypt from 'bcrypt';

export const getAll = (filters = {}) => {
  return prisma.user.findMany({
    where: filters.search ? {
      OR: [
        { FirstName: { contains: filters.search } },
        { LastName: { contains: filters.search } }
      ]
    } : {},
    include: {
      usercontact: true
    }
  });
};

export const getById = (id) => {
  return prisma.user.findUnique({
    where: { UserID: parseInt(id) },
    include: {
      usercontact: true
    }
  });
};

export const create = async (data) => {
  const { email, password, Password, FirstName, LastName, Age, CampusCity, Gender, Bio, Role, ...otherData } = data;
  
  const passwordValue = Password || password;
  const passwordHash = passwordValue && typeof passwordValue === 'string' && passwordValue.trim() !== '' 
    ? await bcrypt.hash(passwordValue, 10) 
    : null;

  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        FirstName,
        LastName,
        Age,
        CampusCity,
        Gender,
        Bio,
        Role,
        PasswordHash: passwordHash,
        ...otherData
      }
    });

    if (email) {
      await tx.usercontact.create({
        data: {
          UserID: user.UserID,
          Email: email
        }
      });
    }

    return user;
  });
};

export const update = async (id, data) => {
  const { email, password, Password, ...userData } = data;
  
  const passwordValue = Password || password;
  if (passwordValue && typeof passwordValue === 'string' && passwordValue.trim() !== '') {
    userData.PasswordHash = await bcrypt.hash(passwordValue, 10);
  }

  return prisma.$transaction(async (tx) => {
    const user = await tx.user.update({
      where: { UserID: parseInt(id) },
      data: userData
    });

    if (email) {
      await tx.usercontact.upsert({
        where: { UserContactID: user.UserID },
        update: { Email: email },
        create: {
          UserID: user.UserID,
          Email: email
        }
      });
    }

    return user;
  });
};

export const remove = (id) => {
  return prisma.user.delete({
    where: { UserID: parseInt(id) }
  });
};

// Delete own account with all related data
export const deleteOwnAccount = async (userId) => {
  const userIdInt = parseInt(userId);
  
  return prisma.$transaction(async (tx) => {
    // 1. Delete all venues owned by this user (and their related data)
    const userVenues = await tx.venue.findMany({
      where: { OwnerID: userIdInt },
      select: { VenueID: true }
    });
    
    for (const venue of userVenues) {
      // Delete venuefoto
      await tx.venuefoto.deleteMany({
        where: { VenueID: venue.VenueID }
      });
      
      // Delete venuesfeerbeeld
      await tx.venuesfeerbeeld.deleteMany({
        where: { VenueID: venue.VenueID }
      });
      
      // Delete venuestatus
      await tx.venuestatus.deleteMany({
        where: { VenueID: venue.VenueID }
      });
      
      // Delete feedback
      await tx.feedback.deleteMany({
        where: { VenueID: venue.VenueID }
      });
      
      // Delete favorites
      await tx.favorite.deleteMany({
        where: { VenueID: venue.VenueID }
      });
      
      // Delete venuecontact
      await tx.venuecontact.deleteMany({
        where: { VenueID: venue.VenueID }
      });
      
      // Delete venueaddress
      await tx.venueaddress.deleteMany({
        where: { VenueID: venue.VenueID }
      });
      
      // Delete venue
      await tx.venue.delete({
        where: { VenueID: venue.VenueID }
      });
    }
    
    // 2. Delete user's favorites
    await tx.favorite.deleteMany({
      where: { UserID: userIdInt }
    });
    
    // 3. Delete user's feedback
    await tx.feedback.deleteMany({
      where: { UserID: userIdInt }
    });
    
    // 4. Delete user's venue pings
    await tx.venueping.deleteMany({
      where: { UserID: userIdInt }
    });
    
    // 5. Delete user's role requests
    await tx.rolerequest.deleteMany({
      where: { UserID: userIdInt }
    });
    
    // 6. Delete user's roles
    await tx.user_role.deleteMany({
      where: { UserID: userIdInt }
    });
    
    // 7. Delete user's friends (where user is UserID1, UserID2, or RequestedBy)
    await tx.friend.deleteMany({
      where: {
        OR: [
          { UserID1: userIdInt },
          { UserID2: userIdInt },
          { RequestedBy: userIdInt }
        ]
      }
    });
    
    // 8. Delete chats where user is involved (and their messages)
    const userChats = await tx.chat.findMany({
      where: {
        OR: [
          { UserID1: userIdInt },
          { UserID2: userIdInt }
        ]
      },
      select: { ChatID: true }
    });
    
    for (const chat of userChats) {
      // Delete chat messages
      await tx.chatmessage.deleteMany({
        where: { ChatID: chat.ChatID }
      });
      
      // Delete chat
      await tx.chat.delete({
        where: { ChatID: chat.ChatID }
      });
    }
    
    // 9. Delete user's chat messages (in case any remain)
    await tx.chatmessage.deleteMany({
      where: { SenderID: userIdInt }
    });
    
    // 10. Delete user's contacts
    await tx.usercontact.deleteMany({
      where: { UserID: userIdInt }
    });
    
    // 11. Finally delete the user
    return tx.user.delete({
      where: { UserID: userIdInt }
    });
  });
};

// Location preferences
export const updateLocationPreference = async (userId, data) => {
  const { locationTrackingEnabled, locationLat, locationLng } = data;
  
  const updateData = {};
  if (locationTrackingEnabled !== undefined) {
    updateData.LocationTrackingEnabled = locationTrackingEnabled;
  }
  if (locationLat !== undefined && locationLat !== null) {
    updateData.LocationLat = parseFloat(locationLat);
  }
  if (locationLng !== undefined && locationLng !== null) {
    updateData.LocationLng = parseFloat(locationLng);
  }
  
  return prisma.user.update({
    where: { UserID: parseInt(userId) },
    data: updateData,
    select: {
      UserID: true,
      LocationTrackingEnabled: true,
      LocationLat: true,
      LocationLng: true
    }
  });
};

export const getLocationPreference = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { UserID: parseInt(userId) },
    select: {
      UserID: true,
      LocationTrackingEnabled: true,
      LocationLat: true,
      LocationLng: true
    }
  });
  
  if (!user) {
    return null;
  }
  
  return {
    locationTrackingEnabled: user.LocationTrackingEnabled || false,
    locationLat: user.LocationLat ? Number(user.LocationLat) : null,
    locationLng: user.LocationLng ? Number(user.LocationLng) : null
  };
};

