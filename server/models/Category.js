const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true,
    maxlength: [30, 'Category name cannot exceed 30 characters']
  },
  color: {
    type: String,
    required: [true, 'Color is required'],
    default: '#6b7280'
  },
  icon: {
    type: String,
    default: 'tag'
  },
  isDefault: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Category', CategorySchema);