require('dotenv').config();

const config = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/finance_dashboard',
  jwtSecret: process.env.JWT_SECRET || 'supersecretjwtkey', // Fallback for development, but should be strong
  jwtExpiresIn: '1d' // JWT token expiration time
};

module.exports = config;
