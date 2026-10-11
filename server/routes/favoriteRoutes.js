const express = require('express');
const {
  addFavorite,
  getFavorites,
  removeFavorite,
  getFavoriteIds,
} = require('../controllers/favoriteController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All favorites routes are protected
router.use(protect);

// GET favorite template IDs
router.get('/ids', getFavoriteIds);

// GET all favorites for authenticated user
router.get('/', getFavorites);

// POST add favorite
router.post('/:templateId', addFavorite);

// DELETE remove favorite
router.delete('/:templateId', removeFavorite);

module.exports = router;
