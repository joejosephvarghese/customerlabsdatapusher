const { Account, Destination } = require("../model");
const ApiError = require("../utils/apiError");
const catchAsync = require("../utils/catchAsync");

// Create Destination
const createDestination = catchAsync(async (req, res) => {
  const { accountId } = req.params;
  const { url, httpMethod, headers } = req.body;

  const account = await Account.findOne({ where: { id: accountId } });
  if (!account) {
    throw new ApiError(404, "Account not found");
  }

  const newDestination = await Destination.create({
    url,
    httpMethod,
    headers,
    accountId: account.id,
  });
  console.log(newDestination, "newdestination");

  const destinationData = newDestination.get({ plain: true });

  res.status(201).json({
    status: "success",
    data: {
      destination: destinationData,
    },
  });
});

// Get All Destinations for Account
const getDestinationsForAccount = catchAsync(async (req, res) => {
  const { accountId } = req.params;

  const account = await Account.findOne({ where: { id: accountId } });
  if (!account) {
    throw new ApiError(404, "Account not found");
  }

  const destinations = await Destination.findAll({
    where: { accountId: account.id },
  });

  res.json({
    status: "success",
    data: { destinations },
  });
});

// Get Single Destination
const getDestination = catchAsync(async (req, res) => {
  const { destinationId } = req.params;

  const destination = await Destination.findByPk(destinationId);
  if (!destination) {
    throw new ApiError(404, "Destination not found");
  }

  // Optionally include account information
  const account = await Account.findByPk(destination.accountId);
  const destinationData = destination.get({ plain: true });
  if (account) {
    destinationData.stringAccountId = account.accountId;
  }

  res.json({
    status: "success",
    data: { destination: destinationData },
  });
});

// Update Destination
const updateDestination = catchAsync(async (req, res) => {
  const { destinationId } = req.params;
  const { url, httpMethod, headers } = req.body;

  const destination = await Destination.findByPk(destinationId);
  if (!destination) {
    throw new ApiError(404, "Destination not found");
  }

  // Update only the provided fields
  if (url !== undefined) destination.url = url;
  if (httpMethod !== undefined) destination.httpMethod = httpMethod;
  if (headers !== undefined) destination.headers = headers;

  await destination.save();

  res.json({
    status: "success",
    data: { destination },
  });
});

// Delete Destination
const deleteDestination = catchAsync(async (req, res) => {
  const { destinationId } = req.params;

  const destination = await Destination.findByPk(destinationId);
  if (!destination) {
    throw new ApiError(404, "Destination not found");
  }

  await destination.destroy();

  res.status(204).json({
    status: "success",
    data: null,
  });
});

module.exports = {
  createDestination,
  getDestinationsForAccount,
  getDestination,
  updateDestination,
  deleteDestination,
};
