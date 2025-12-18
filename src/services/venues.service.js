import prisma from '../prisma/client.js';//enkel prisma in services folder

export const getAll = (filters) => {
  return prisma.venue.findMany({
    where: {
      Name: { contains: filters.search }
    },
    include: {
      venueaddress: true,
      venuestatus: {
        orderBy: { TimeStamp: 'desc' },
        take: 1
      }
    }
  });
};

export const create = (ownerId, data) => {
  return prisma.venue.create({
    data: {
      ...data,
      ownerId
    }
  });
};
