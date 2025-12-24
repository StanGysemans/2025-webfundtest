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

