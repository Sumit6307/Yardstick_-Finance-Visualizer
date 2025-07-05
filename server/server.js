// server/server.js
const app = require('./app');
const mongoose = require('mongoose');
const config = require('./config/config'); // This now points to the correct file

mongoose.connect(config.mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = config.port || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));