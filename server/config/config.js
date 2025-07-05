// server/config/config.js
require('dotenv').config();

module.exports = {
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/finance-visualizer',
  port: process.env.PORT || 5000
};