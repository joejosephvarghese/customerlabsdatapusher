
const { StatusCodes } = require('http-status-codes');
const ApiError = require('../utils/apiError');
const { ValidationError, UniqueConstraintError } = require('sequelize'); // Import Sequelize error types

const errorConverter = (err, req, res, next) => {
    let error = err;
  
    if (error instanceof ValidationError) {
      error = new ApiError(StatusCodes.BAD_REQUEST, error.message, false, err.stack);
    } else if (error instanceof UniqueConstraintError) {
      error = new ApiError(StatusCodes.BAD_REQUEST, 'Unique constraint violation', false, err.stack);
    } else if (!(error instanceof ApiError)) {
      const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR; // Default to INTERNAL_SERVER_ERROR
      const message = error.message || httpStatus[statusCode];
      error = new ApiError(statusCode, message, false, err.stack);
    }
  
    next(error);
  };
  

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
    let { statusCode, message } = err;
  
    // Set default statusCode if missing
    if (!statusCode) {
      statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
      message = message || httpStatus[statusCode];
    }
  
    // If the environment is production, don't reveal stack trace
    if (process.env.NODE_ENV === 'production' && !err.isOperational) {
      message = httpStatus[StatusCodes.INTERNAL_SERVER_ERROR];
    }
  
    // Set local error message for logging
    res.locals.errorMessage = err.message;
  
    // Create the response object
    const response = {
      code: statusCode,
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }), // Include stack in dev environment
    };
  
    // Log the error in development
    if (process.env.NODE_ENV === 'development') {
      console.error(err); // Use logger in your app
    }
  
    res.status(statusCode).send(response);
  };
  
  
module.exports = {
  errorConverter,
  errorHandler,
};
