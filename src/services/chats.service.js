import prisma from '../../prisma/client.js';

export const getAll = (userId) => {
  return prisma.chat.findMany({
    where: {
      OR: [
        { UserID1: parseInt(userId) },
        { UserID2: parseInt(userId) }
      ]
    },
    include: {
      user_chat_UserID1Touser: {
        select: {
          UserID: true,
          FirstName: true,
          LastName: true
        }
      },
      user_chat_UserID2Touser: {
        select: {
          UserID: true,
          FirstName: true,
          LastName: true
        }
      },
      chatmessage: {
        orderBy: { SentAt: 'desc' },
        take: 1
      }
    }
  });
};

export const getById = (id, userId) => {
  return prisma.chat.findFirst({
    where: {
      ChatID: parseInt(id),
      OR: [
        { UserID1: parseInt(userId) },
        { UserID2: parseInt(userId) }
      ]
    },
    include: {
      user_chat_UserID1Touser: {
        select: {
          UserID: true,
          FirstName: true,
          LastName: true
        }
      },
      user_chat_UserID2Touser: {
        select: {
          UserID: true,
          FirstName: true,
          LastName: true
        }
      },
      chatmessage: {
        orderBy: { SentAt: 'asc' },
        include: {
          user: {
            select: {
              UserID: true,
              FirstName: true,
              LastName: true
            }
          }
        }
      }
    }
  });
};

export const create = (userID1, userID2) => {
  // Ensure consistent ordering (smaller ID first)
  const [id1, id2] = userID1 < userID2 ? [userID1, userID2] : [userID2, userID1];
  
  return prisma.chat.upsert({
    where: {
      UserID1_UserID2: {
        UserID1: id1,
        UserID2: id2
      }
    },
    update: {},
    create: {
      UserID1: id1,
      UserID2: id2,
      CreatedAt: new Date()
    },
    include: {
      user_chat_UserID1Touser: true,
      user_chat_UserID2Touser: true
    }
  });
};

export const getMessages = (chatId) => {
  return prisma.chatmessage.findMany({
    where: { ChatID: parseInt(chatId) },
    orderBy: { SentAt: 'asc' },
    include: {
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

export const createMessage = (chatId, senderId, MessageText) => {
  return prisma.chatmessage.create({
    data: {
      ChatID: parseInt(chatId),
      SenderID: parseInt(senderId),
      MessageText: MessageText,
      SentAt: new Date()
    },
    include: {
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
  return prisma.chat.delete({
    where: { ChatID: parseInt(id) }
  });
};

