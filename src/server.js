//kijke code leerkracht
//endpoints toevoegen voor elke pagina 
//app.listen 3001 doet luisteren naar poort 3001 local host nodig voor postman
import 'dotenv/config';
// #region agent log
fetch('http://127.0.0.1:7242/ingest/f025a4e3-0e44-4ac7-9127-cd99e47a3f90',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'src/server.js:5',message:'Server startup - DATABASE_URL check',data:{DATABASE_URL:process.env.DATABASE_URL ? (process.env.DATABASE_URL.substring(0,30) + '...') : 'NOT_SET',PORT:process.env.PORT || 'NOT_SET'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
// #endregion
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/users.routes.js';
import venueRoutes from './routes/venues.routes.js';
import venueAddressRoutes from './routes/venueaddress.routes.js';
import venueContactRoutes from './routes/venuecontact.routes.js';
import venueFotoRoutes from './routes/venuefoto.routes.js';
import venueSfeerbeeldRoutes from './routes/venuesfeerbeeld.routes.js';
import venueStatusRoutes from './routes/venuestatus.routes.js';
import venuePingRoutes from './routes/venueping.routes.js';
import * as venuePingService from './services/venueping.service.js';
import chatRoutes from './routes/chats.routes.js';
import favoriteRoutes from './routes/favorites.routes.js';
import feedbackRoutes from './routes/feedback.routes.js';
import friendRoutes from './routes/friends.routes.js';
import roleRequestRoutes from './routes/rolerequests.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/venues', venueRoutes);
// Nested routes for venue-related entities
app.use('/venues/:venueId/addresses', venueAddressRoutes);
app.use('/venues/:venueId/contacts', venueContactRoutes);
app.use('/venues/:venueId/fotos', venueFotoRoutes);
app.use('/venues/:venueId/sfeerbeelden', venueSfeerbeeldRoutes);
app.use('/venues/:venueId/statuses', venueStatusRoutes);
app.use('/venues/:venueId/pings', venuePingRoutes); // Venue ping routes
app.use('/chats', chatRoutes);
app.use('/favorites', favoriteRoutes);
app.use('/feedback', feedbackRoutes);
app.use('/friends', friendRoutes);
app.use('/rolerequests', roleRequestRoutes);

const PORT = process.env.PORT || 3001;

// Start periodic cleanup of old pings (every 15 minutes)
const CLEANUP_INTERVAL_MS = 15 * 60 * 1000; // 15 minutes

setInterval(async () => {
  try {
    await venuePingService.cleanupOldPings();
  } catch (error) {
    console.error('Periodic cleanup error:', error);
  }
}, CLEANUP_INTERVAL_MS);

// Run cleanup once on server start
venuePingService.cleanupOldPings().catch(err => {
  console.error('Initial cleanup error:', err);
});

app.listen(PORT, () =>
  console.log(`API running on port ${PORT}`)
);
