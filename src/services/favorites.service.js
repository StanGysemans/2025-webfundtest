import prisma from '../../prisma/client.js';

export const getAll = (userId) => {
  return prisma.favorite.findMany({
    where: { UserID: parseInt(userId) },
    include: {
      venue: {
        include: {
          venueaddress: true,
          venuecontact: true,
          venuetype: true,
          venuestatus: {
            orderBy: { TimeStamp: 'desc' },
            take: 1
          }
        }
      }
    }
  });
};

export const getById = (id) => {
  return prisma.favorite.findUnique({
    where: { FavoriteID: parseInt(id) },
    include: {
      venue: {
        include: {
          venueaddress: true,
          venuecontact: true,
          venuetype: true
        }
      },
      user: true
    }
  });
};

export const create = (userId, venueId) => {
  return prisma.favorite.create({
    data: {
      UserID: parseInt(userId),
      VenueID: parseInt(venueId),
      AddedAt: new Date()
    },
    include: {
      venue: {
        include: {
          venueaddress: true,
          venuecontact: true,
          venuetype: true
        }
      }
    }
  });
};

export const remove = (id) => {
  return prisma.favorite.delete({
    where: { FavoriteID: parseInt(id) }
  });
};

export const removeByVenue = (userId, venueId) => {
  return prisma.favorite.deleteMany({
    where: {
      UserID: parseInt(userId),
      VenueID: parseInt(venueId)
    }
  });
};

