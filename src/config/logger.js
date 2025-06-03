const winston = require('winston');
const config = require('./config');

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { 
      message: info.stack,
      ...(info.response && { response: info.response }) // Include API response if exists
    });
  }
  return info;
});

const logger = winston.createLogger({
  level: config.env === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    enumerateErrorFormat(),
    config.env === 'development' ? winston.format.colorize() : winston.format.uncolorize(),
    winston.format.splat(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ['error'],
    }),
    // Add file transport in production
    ...(config.env === 'production' ? [
      new winston.transports.File({ 
        filename: 'logs/combined.log',
        level: 'info'
      }),
      new winston.transports.File({
        filename: 'logs/errors.log',
        level: 'error'
      })
    ] : [])
  ],
  rejectionHandlers: [
    new winston.transports.Console(),
    ...(config.env === 'production' ? [
      new winston.transports.File({ filename: 'logs/rejections.log' })
    ] : [])
  ]
});

// Handle uncaught exceptions
logger.exceptions.handle(
  new winston.transports.Console(),
  ...(config.env === 'production' ? [
    new winston.transports.File({ filename: 'logs/exceptions.log' })
  ] : [])
);

module.exports = logger;