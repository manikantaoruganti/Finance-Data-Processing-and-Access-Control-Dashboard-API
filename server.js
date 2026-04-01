require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');
const config = require('./src/config');

const PORT = config.port;
const MONGO_URI = config.mongoUri;

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully.');
    // Start the Express server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit process with failure
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  // Optionally, close server and exit process
  // server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', err => {
  console.error(`Uncaught Exception: ${err.message}`);
  // Optionally, close server and exit process
  // server.close(() => process.exit(1));
});
