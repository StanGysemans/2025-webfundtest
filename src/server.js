//kijke code leerkracht
//endpoints toevoegen voor elke pagina 
//app.listen 3000 doet luisteren naar poort 3000 local host nodig voor postman
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/users.routes.js';
import venueRoutes from './routes/venues.routes.js';
import chatRoutes from './routes/chats.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/venues', venueRoutes);
app.use('/chats', chatRoutes);

app.listen(process.env.PORT || 3000, () =>
  console.log('API running...')
);
