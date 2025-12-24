import prisma from '../../prisma/client.js';

export const create = async (userId, requestedRole, message) => {
  // Check if user already has a pending request
  const existingRequest = await prisma.rolerequest.findFirst({
    where: {
      UserID: parseInt(userId),
      Status: 'pending'
    }
  });

  if (existingRequest) {
    throw new Error('You already have a pending role request');
  }

  // Check if user already has this role
  const user = await prisma.user.findUnique({
    where: { UserID: parseInt(userId) }
  });

  if (user.Role === requestedRole) {
    throw new Error('You already have this role');
  }

  return prisma.rolerequest.create({
    data: {
      UserID: parseInt(userId),
      RequestedRole: requestedRole,
      Message: message,
      Status: 'pending',
      CreatedAt: new Date()
    }
  });
};

export const getAll = (filters = {}) => {
  const where = {};
  
  if (filters.userId) {
    where.UserID = parseInt(filters.userId);
  }
  
  if (filters.status) {
    where.Status = filters.status;
  }

  return prisma.rolerequest.findMany({
    where,
    include: {
      user: {
        select: {
          UserID: true,
          FirstName: true,
          LastName: true,
          usercontact: {
            select: {
              Email: true
            }
          }
        }
      }
    },
    orderBy: {
      CreatedAt: 'desc'
    }
  });
};

export const getById = (id) => {
  return prisma.rolerequest.findUnique({
    where: { RoleRequestID: parseInt(id) },
    include: {
      user: {
        include: {
          usercontact: true
        }
      }
    }
  });
};

export const updateStatus = async (id, status, reviewedBy) => {
  const request = await prisma.rolerequest.findUnique({
    where: { RoleRequestID: parseInt(id) },
    include: { user: true }
  });

  if (!request) {
    throw new Error('Role request not found');
  }

  // Update request status
  const updatedRequest = await prisma.rolerequest.update({
    where: { RoleRequestID: parseInt(id) },
    data: {
      Status: status,
      ReviewedAt: new Date(),
      ReviewedBy: reviewedBy ? parseInt(reviewedBy) : null
    }
  });

  // If approved, update user role
  if (status === 'approved') {
    await prisma.user.update({
      where: { UserID: request.UserID },
      data: {
        Role: request.RequestedRole
      }
    });
  }

  return updatedRequest;
};

export const remove = (id) => {
  return prisma.rolerequest.delete({
    where: { RoleRequestID: parseInt(id) }
  });
};

