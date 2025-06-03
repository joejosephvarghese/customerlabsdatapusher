// src/config/config.js
require('dotenv').config(); // To load environment variables from .env file

// Database configuration for Sequelize
module.exports.dbConfig = {
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT || 'postgres', // Default to PostgreSQL if not set
  
};

module.exports.jwtConfig={
jwt:process.env.JWT_SECRET
}

// Helmet security settings
module.exports.helmetConfig = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:'],
      scriptSrc: ["'self'", "'unsafe-eval'"],
    },
  },
  frameguard: { action: 'deny' },  // Disable framing
  xssFilter: true,  // Enable XSS filter
  noSniff: true,    // Prevent browsers from sniffing content type
};
