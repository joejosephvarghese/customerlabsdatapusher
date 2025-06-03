// controllers/destinationController.js
const { Account, Destination } = require('../model');
const ApiError = require('../utils/apiError');
const catchAsync = require('../utils/catchAsync');

// Create Destination
exports.createDestination = catchAsync(async (req, res) => {
  const { accountId } = req.params; // This is the string accountId (acc_xxxx)
  const { url, httpMethod, headers } = req.body;

  // Find account by its string accountId
  const account = await Account.findOne({ where: { id:accountId} });
  if (!account) {
    throw new ApiError(404, 'Account not found');
  }

  // Create destination with the account's INTEGER id as foreign key
  const newDestination = await Destination.create({
    url,
    httpMethod,
    headers,
    accountId: account.id // Use the integer id, not account.accountId
  });
  console.log(newDestination,"newdestination")

  const destinationData = newDestination.get({ plain: true });
  
  // If you want to include the string accountId in response
  destinationData.stringAccountId = account.accountId;

  res.status(201).json({
    status: 'success',
    data: { 
      destination: destinationData 
    }
  });
});
// Get All Destinations for Account
exports.getDestinationsForAccount = catchAsync(async (req, res) => {
  const { accountId } = req.params;

  const account = await Account.findOne({ where: { id:accountId } });
  if (!account) {
    throw new ApiError(404, 'Account not found');
  }

  const destinations = await Destination.findAll({
    where: { accountId: account.id }
  });

  res.json({
    status: 'success',
    data: { destinations }
  });
});



