const mongoose = require('mongoose');
const Favorite = require('../models/Favorite');
const Template = require('../models/Template');

// @desc    Add a template to user favorites
// @route   POST /api/favorites/:templateId
// @access  Private
const addFavorite = async (req, res, next) => {
  try {
    const { templateId } = req.params;
    const userId = req.userId;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(templateId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid template identifier format',
      });
    }

    // Verify template exists in database
    const template = await Template.findById(templateId);
    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found',
      });
    }

    // Check if already favorited
    const existingFavorite = await Favorite.findOne({
      user: userId,
      template: templateId,
    });

    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        message: 'This template is already in your favorites',
      });
    }

    // Create favorite
    const favorite = await Favorite.create({
      user: userId,
      template: templateId,
    });

    const populatedFavorite = await Favorite.findById(favorite._id).populate('template');

    return res.status(201).json({
      success: true,
      message: 'Template added to favorites',
      data: populatedFavorite,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'This template is already in your favorites',
      });
    }
    next(error);
  }
};

// @desc    Get current user's favorite templates
// @route   GET /api/favorites
// @access  Private
const getFavorites = async (req, res, next) => {
  try {
    const userId = req.userId;

    const favorites = await Favorite.find({ user: userId })
      .populate('template')
      .sort({ createdAt: -1 });

    // Filter out entries where template was deleted or missing
    const validFavorites = favorites.filter((fav) => fav.template !== null);

    return res.status(200).json({
      success: true,
      count: validFavorites.length,
      data: validFavorites,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove a template from user favorites
// @route   DELETE /api/favorites/:templateId
// @access  Private
const removeFavorite = async (req, res, next) => {
  try {
    const { templateId } = req.params;
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(templateId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid template identifier format',
      });
    }

    const favorite = await Favorite.findOneAndDelete({
      user: userId,
      template: templateId,
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: 'Favorite entry not found for this template',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Template removed from favorites',
      data: { templateId },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all favorite template IDs for the logged-in user
// @route   GET /api/favorites/ids
// @access  Private
const getFavoriteIds = async (req, res, next) => {
  try {
    const userId = req.userId;

    const favorites = await Favorite.find({ user: userId }).select('template');
    const templateIds = favorites.map((fav) => fav.template.toString());

    return res.status(200).json({
      success: true,
      count: templateIds.length,
      data: templateIds,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addFavorite,
  getFavorites,
  removeFavorite,
  getFavoriteIds,
};
