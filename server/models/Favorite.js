const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    template: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Template',
      required: [true, 'Template reference is required'],
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Compound index to guarantee uniqueness: a user can only favorite a template once
favoriteSchema.index({ user: 1, template: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
