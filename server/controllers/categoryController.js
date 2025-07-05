const Category = require('../models/Category');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ isDefault: -1, name: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Add a category
// @route   POST /api/categories
// @access  Public
exports.addCategory = async (req, res) => {
  try {
    const { name, color, icon } = req.body;
    
    const category = new Category({
      name,
      color,
      icon
    });
    
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Public
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, color, icon } = req.body;
    
    const category = await Category.findByIdAndUpdate(
      id,
      { name, color, icon },
      { new: true }
    );
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Public
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await Category.findByIdAndDelete(id);
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};