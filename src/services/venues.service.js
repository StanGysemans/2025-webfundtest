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

export const create = (ownerId, data) => {
  return prisma.venue.create({
    data: {
      ...data,
      OwnerID: ownerId
    },
    include: {
      venueaddress: true,
      venuecontact: true,
      venuetype: true
    }
  });
};

export const update = (id, data) => {
  return prisma.venue.update({
    where: { VenueID: parseInt(id) },
    data,
    include: {
      venueaddress: true,
      venuecontact: true,
      venuetype: true
    }
  });
};

export const remove = (id) => {
  return prisma.venue.delete({
    where: { VenueID: parseInt(id) }
  });
};

