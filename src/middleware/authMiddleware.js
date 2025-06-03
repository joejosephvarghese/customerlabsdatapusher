
const { StatusCodes } = require("http-status-codes");
const jwt = require('jsonwebtoken');
const ApiError = require('../utils/apiError');
const { User } = require('../models');
const { userServices } = require("../services");

const getUserInfoMiddleware = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!token) {
    return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Token not provided'));
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      if (err.name === 'JsonWebTokenError') {
        return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid token'));
      } else if (err.name === 'TokenExpiredError') {
        return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Token expired'));
      } else {
        return next(err);
      }
    }

    const userId = decoded.sub;

    try {

        const user= await  userServices.findById(userId)
     

      if (!user) {
        return next(new ApiError(StatusCodes.UNAUTHORIZED, 'User not found'));
      }

      req.user = user;

      next();
    } catch (error) {
      next(error);
    }
  });
};

module.exports = getUserInfoMiddleware;
