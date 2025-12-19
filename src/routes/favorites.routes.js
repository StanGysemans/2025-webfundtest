import express from 'express';
import {
  getFavorites,
  getFavoriteById,
  createFavorite,
  deleteFavorite,
  deleteFavoriteByVenue
} from '../controllers/favorites.controllers.js';
import { auth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', auth, getFavorites);
router.get('/:id', auth, getFavoriteById);
router.post('/', auth, createFavorite);
router.delete('/:id', auth, deleteFavorite);
router.delete('/venue/:venueId', auth, deleteFavoriteByVenue);

export default router;

