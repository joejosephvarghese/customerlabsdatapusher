const catchAsync = require("../utils/catchAsync");
const { Account, Destination } = require("../model");
const ApiError = require("../utils/apiError");

const axios = require("axios");

const handleIncomingData = catchAsync(async (req, res) => {
  const token = req.headers["cl-x-token"];

  if (!token) {
    throw new ApiError(401, "Un Authenticate");
  }

  if (!req.is("application/json")) {
    throw new ApiError(400, "Invalid Data");
  }

  // Step 1: Find account
  const account = await Account.findOne({
    where: { appSecretToken: token },
  });

  if (!account) {
    throw new ApiError(404, "Account not found");
  }

  // Step 2: Find destinations
  const destinations = await Destination.findAll({
    where: {
      accountId: account.id,
    },
  });

  // Step 3: Forward data
  const forwardingResults = await Promise.allSettled(
    destinations.map((destination) =>
      forwardToDestination(destination, req.body)
    )
  );

  const results = forwardingResults.map((result) => ({
    destination: result.value?.config?.url || result.reason.config?.url,
    status: result.status,
    ...(result.status === "fulfilled"
      ? { statusCode: result.value.status }
      : { error: result.reason.message }),
  }));

  res.status(200).json({
    status: "success",
    data: {
      message: "Data forwarding completed",
      results,
    },
  });
});

/**
 * Helper function to forward data to a single destination
 */
async function forwardToDestination(destination, data) {
  const config = {
    url: destination.url,
    method: destination.httpMethod.toLowerCase(),
    headers: {
      ...destination.headers,
      "Content-Type": "application/json",
    },
    // timeout: 5000,
  };

  if (destination.httpMethod === "GET") {
    config.params = data;
  } else {
    config.data = data;
  }

  return axios(config);
}

module.exports = {
  handleIncomingData,
};
