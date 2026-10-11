const mongoose = require('mongoose');
const Template = require('../models/Template');

// @desc    Get all templates with search, filter, and sorting
// @route   GET /api/templates
// @access  Public
const getTemplates = async (req, res, next) => {
  try {
    const { search, category, sort } = req.query;

    let filter = {};

    // Category filter
    if (category && category !== 'All') {
      filter.category = category;
    }

    // Search filter across name and description
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
      ];
    }

    // Sorting logic
    let sortOptions = { createdAt: -1 }; // Default newest
    if (sort === 'name-asc') {
      sortOptions = { name: 1 };
    } else if (sort === 'name-desc') {
      sortOptions = { name: -1 };
    } else if (sort === 'newest') {
      sortOptions = { createdAt: -1 };
    } else if (sort === 'oldest') {
      sortOptions = { createdAt: 1 };
    } else if (sort === 'rating') {
      sortOptions = { rating: -1 };
    }

    const templates = await Template.find(filter).sort(sortOptions);

    return res.status(200).json({
      success: true,
      count: templates.length,
      data: templates,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single template by ID
// @route   GET /api/templates/:id
// @access  Public
const getTemplateById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Invalid template identifier format',
      });
    }

    const template = await Template.findById(id);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: template,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTemplates,
  getTemplateById,
};
