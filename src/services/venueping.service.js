import prisma from '../../prisma/client.js';

// Rate limiting: 5 minutes between pings from same user for same venue
const PING_COOLDOWN_MINUTES = 5;

export const getAll = (venueId) => {
  return prisma.venueping.findMany({
    where: { VenueID: parseInt(venueId) },
    orderBy: { TimeStamp: 'desc' },
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

export const getRecent = (venueId, minutes = 30) => {
  const cutoffTime = new Date();
  cutoffTime.setMinutes(cutoffTime.getMinutes() - minutes);
  
  return prisma.venueping.findMany({
    where: {
      VenueID: parseInt(venueId),
      TimeStamp: {
        gte: cutoffTime
      }
    },
    orderBy: { TimeStamp: 'desc' }
  });
};

// Cleanup old pings (older than 1 hour)
export const cleanupOldPings = async () => {
  try {
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);
    
    const result = await prisma.venueping.deleteMany({
      where: {
        TimeStamp: {
          lt: oneHourAgo
        }
      }
    });
    
    if (result.count > 0) {
      console.log(`[Cleanup] Removed ${result.count} old ping(s) older than 1 hour`);
    }
    
    return result.count;
  } catch (error) {
    console.error('Error cleaning up old pings:', error);
    throw error;
  }
};

export const getAggregatedCrowdLevel = async (venueId, minutes = 30) => {
  // Cleanup old pings before getting crowd level (runs in background, doesn't block)
  cleanupOldPings().catch(err => {
    console.error('Background cleanup error:', err);
  });
  
  const recentPings = await getRecent(venueId, minutes);
  
  if (recentPings.length === 0) {
    return {
      percentage: null,
      pingCount: 0,
      lastUpdated: null
    };
  }
  
  // Calculate average percentage
  const totalPercentage = recentPings.reduce((sum, ping) => sum + ping.Percentage, 0);
  const averagePercentage = Math.round(totalPercentage / recentPings.length);
  
  // Get most recent ping timestamp
  const lastUpdated = recentPings[0]?.TimeStamp || null;
  
  return {
    percentage: averagePercentage,
    pingCount: recentPings.length,
    lastUpdated: lastUpdated
  };
};

export const create = async (venueId, userId, percentage) => {
  try {
    // Validate percentage (0-100)
    const percentageInt = parseInt(percentage);
    if (isNaN(percentageInt) || percentageInt < 0 || percentageInt > 100) {
      throw new Error('Percentage must be between 0 and 100');
    }
    
    // Check rate limiting - has user pinged this venue recently?
    const recentUserPing = await prisma.venueping.findFirst({
      where: {
        VenueID: parseInt(venueId),
        UserID: parseInt(userId),
        TimeStamp: {
          gte: new Date(Date.now() - PING_COOLDOWN_MINUTES * 60 * 1000)
        }
      },
      orderBy: { TimeStamp: 'desc' }
    });
    
    if (recentUserPing) {
      const minutesAgo = Math.round((Date.now() - new Date(recentUserPing.TimeStamp).getTime()) / (60 * 1000));
      throw new Error(`Je kunt slechts één keer per ${PING_COOLDOWN_MINUTES} minuten pingen. Laatste ping was ${minutesAgo} minuten geleden.`);
    }
    
    // Verify venue exists
    const venue = await prisma.venue.findUnique({
      where: { VenueID: parseInt(venueId) }
    });
    
    if (!venue) {
      throw new Error(`Venue with ID ${venueId} not found`);
    }
    
    // Create ping
    const ping = await prisma.venueping.create({
      data: {
        VenueID: parseInt(venueId),
        UserID: parseInt(userId),
        Percentage: percentageInt,
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
    
    return ping;
  } catch (error) {
    throw new Error(error.message || 'Er is een fout opgetreden bij het aanmaken van de ping');
  }
};

export const getUserRecentPing = async (venueId, userId) => {
  return prisma.venueping.findFirst({
    where: {
      VenueID: parseInt(venueId),
      UserID: parseInt(userId)
    },
    orderBy: { TimeStamp: 'desc' }
  });
};

export const update = async (venueId, userId, percentage, pingId) => {
  try {
    // Validate percentage (0-100)
    const percentageInt = parseInt(percentage);
    if (isNaN(percentageInt) || percentageInt < 0 || percentageInt > 100) {
      throw new Error('Percentage must be between 0 and 100');
    }
    
    // Verify ping exists and belongs to user
    const existingPing = await prisma.venueping.findFirst({
      where: {
        PingID: parseInt(pingId),
        VenueID: parseInt(venueId),
        UserID: parseInt(userId)
      }
    });
    
    if (!existingPing) {
      throw new Error('Ping not found or does not belong to user');
    }
    
    // Update ping
    const ping = await prisma.venueping.update({
      where: {
        PingID: parseInt(pingId)
      },
      data: {
        Percentage: percentageInt,
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
    
    return ping;
  } catch (error) {
    throw new Error(error.message || 'Er is een fout opgetreden bij het bijwerken van de ping');
  }
};

