import prisma from '../../prisma/client.js';

export const getAll = (userId) => {
  return prisma.friend.findMany({
    where: {
      OR: [
        { UserID1: parseInt(userId) },
        { UserID2: parseInt(userId) }
      ]
    },
    include: {
      user_friend_UserID1Touser: {
        select: {
          UserID: true,
          FirstName: true,
          LastName: true,
          AvatarColor: true,
          AvatarColorDark: true
        }
      },
      user_friend_UserID2Touser: {
        select: {
          UserID: true,
          FirstName: true,
          LastName: true,
          AvatarColor: true,
          AvatarColorDark: true
        }
      },
      user_friend_RequestedByTouser: {
        select: {
          UserID: true,
          FirstName: true,
          LastName: true,
          AvatarColor: true,
          AvatarColorDark: true
        }
      }
    }
  });
};

export const getById = (id) => {
  return prisma.friend.findUnique({
    where: { FriendID: parseInt(id) },
    include: {
      user_friend_UserID1Touser: true,
      user_friend_UserID2Touser: true,
      user_friend_RequestedByTouser: true
    }
  });
};

export const create = (userId1, userId2, requestedBy) => {
  // Ensure consistent ordering (smaller ID first)
  const [id1, id2] = userId1 < userId2 ? [userId1, userId2] : [userId2, userId1];
  
  return prisma.friend.create({
    data: {
      UserID1: id1,
      UserID2: id2,
      RequestedBy: requestedBy,
      Status: 'pending',
      CreatedAt: new Date()
    },
    include: {
      user_friend_UserID1Touser: true,
      user_friend_UserID2Touser: true,
      user_friend_RequestedByTouser: true
    }
  });
};

export const updateStatus = (id, status) => {
  return prisma.friend.update({
    where: { FriendID: parseInt(id) },
    data: { Status: status },
    include: {
      user_friend_UserID1Touser: true,
      user_friend_UserID2Touser: true,
      user_friend_RequestedByTouser: true
    }
  });
};

export const accept = (id) => {
  return updateStatus(id, 'accepted');
};

export const block = (id) => {
  return updateStatus(id, 'blocked');
};

export const remove = (id) => {
  return prisma.friend.delete({
    where: { FriendID: parseInt(id) }
  });
};

export const getPendingRequests = (userId) => {
  const userIdInt = parseInt(userId);
  return prisma.friend.findMany({
    where: {
      AND: [
        {
          OR: [
            { UserID1: userIdInt },
            { UserID2: userIdInt }
          ]
        },
        { Status: 'pending' },
        { NOT: { RequestedBy: userIdInt } }
      ]
    },
    include: {
      user_friend_UserID1Touser: {
        select: {
          UserID: true,
          FirstName: true,
          LastName: true,
          AvatarColor: true,
          AvatarColorDark: true
        }
      },
      user_friend_UserID2Touser: {
        select: {
          UserID: true,
          FirstName: true,
          LastName: true,
          AvatarColor: true,
          AvatarColorDark: true
        }
      },
      user_friend_RequestedByTouser: {
        select: {
          UserID: true,
          FirstName: true,
          LastName: true,
          AvatarColor: true,
          AvatarColorDark: true
        }
      }
    }
  });
};

