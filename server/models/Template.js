const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Template name is required'],
      trim: true,
      maxlength: [100, 'Template name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Template description is required'],
      trim: true,
    },
    thumbnail_url: {
      type: String,
      required: [true, 'Thumbnail image URL is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      enum: [
        'Portfolio',
        'E-commerce',
        'SaaS Dashboard',
        'Landing Page',
        'Blog',
        'Restaurant',
        'Education',
        'Agency',
        'Other',
      ],
    },
    price: {
      type: Number,
      default: 0,
    },
    demo_url: {
      type: String,
      default: '#',
    },
    features: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      default: 4.8,
    },
  },
  {
    timestamps: true,
  }
);

// Add text indexing for search optimization
templateSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Template', templateSchema);
