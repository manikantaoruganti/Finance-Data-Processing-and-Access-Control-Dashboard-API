const express = require('express');
const allRoutes = require('./src/routes');
const { errorHandler } = require('./src/middleware/error');

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// API routes
app.use('/api', allRoutes);

// Catch-all for undefined routes
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// Global error handling middleware
app.use(errorHandler);

module.exports = app;
