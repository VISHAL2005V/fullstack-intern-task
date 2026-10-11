const express = require('express');
const {
  getTemplates,
  getTemplateById,
} = require('../controllers/templateController');

const router = express.Router();

// GET all templates (supports ?search=, ?category=, ?sort=)
router.get('/', getTemplates);

// GET template by ID
router.get('/:id', getTemplateById);

module.exports = router;
