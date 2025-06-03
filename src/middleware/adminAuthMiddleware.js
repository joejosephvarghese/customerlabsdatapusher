const httpStatus = require('http-status');
const ApiError = require('../utils/apiError');

const adminAuthMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return next(new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to perform this action'));
  }
  next();
};

module.exports = adminAuthMiddleware;