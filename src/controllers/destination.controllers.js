// controllers/destinationController.js
const { Account, Destination } = require('../model');
const ApiError = require('../utils/apiError');
const catchAsync = require('../utils/catchAsync');

// Create Destination
exports.createDestination = catchAsync(async (req, res) => {
  const { accountId } = req.params;
  const { url, httpMethod, headers } = req.body;

  const account = await Account.findOne({ where: { accountId } });
  if (!account) {
    throw new ApiError(404, 'Account not found');
  }

  const newDestination = await Destination.create({
    url,
    httpMethod,
    headers,
    AccountId: account.id
  });

  res.status(201).json({
    status: 'success',
    data: { destination: newDestination }
  });
});

// Get All Destinations for Account
exports.getDestinationsForAccount = catchAsync(async (req, res) => {
  const { accountId } = req.params;

  const account = await Account.findOne({ where: { accountId } });
  if (!account) {
    throw new ApiError(404, 'Account not found');
  }

  const destinations = await Destination.findAll({
    where: { AccountId: account.id }
  });

  res.json({
    status: 'success',
    data: { destinations }
  });
});



