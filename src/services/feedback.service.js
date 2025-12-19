import prisma from '../../prisma/client.js';

export const getAll = (filters = {}) => {
  return prisma.feedback.findMany({
    where: filters.VenueID ? { VenueID: parseInt(filters.VenueID) } : {},
    include: {
      venue: {
        select: {
          VenueID: true,
          Name: true
        }
      },
      user: {
        select: {
          UserID: true,
          FirstName: true,
          LastName: true
        }
      }
    },
    orderBy: { TimeStamp: 'desc' }
  });
};

export const getById = (id) => {
  return prisma.feedback.findUnique({
    where: { FeedbackID: parseInt(id) },
    include: {
      venue: true,
      user: {
        select: {
          UserID: true,
          FirstName: true,
          LastName: true
        }
      }
    }
  });
};

export const create = (userId, data) => {
  return prisma.feedback.create({
    data: {
      ...data,
      UserID: parseInt(userId),
      TimeStamp: new Date()
    },
    include: {
      venue: true,
      user: {
        select: {
          UserID: true,
          FirstName: true,
          LastName: true
        }
      }
    }
  });
};

export const update = (id, data) => {
  return prisma.feedback.update({
    where: { FeedbackID: parseInt(id) },
    data,
    include: {
      venue: true,
      user: {
        select: {
          UserID: true,
          FirstName: true,
          LastName: true
        }
      }
    }
  });
};

export const remove = (id) => {
  return prisma.feedback.delete({
    where: { FeedbackID: parseInt(id) }
  });
};

