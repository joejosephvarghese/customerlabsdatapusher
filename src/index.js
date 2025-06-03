

require('dotenv').config(); 
const app = require('./app');
const logger = require('./config/logger');


const PORT = process.env.PORT || 5000; 
let server;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});



const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);
