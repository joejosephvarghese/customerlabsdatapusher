const catchAsync = require("../utils/catchAsync");
const { Account,Destination } = require("../model");
const { StatusCodes } = require("http-status-codes");
const ApiError = require("../utils/apiError");
const crypto = require("crypto");

const generateSecretToken = () =>
  `tok_${crypto.randomBytes(16).toString("hex")}`;

const createAccount = catchAsync(async (req, res) => {
  const { email, accountName, website } = req.body;

  if (!email || !accountName) {
    throw new ApiError(400, "Email and account name are required");
  }

  const existingAccount = await Account.findOne({ where: { email } });
  if (existingAccount) {
    throw new ApiError(409, "Email already in use");
  }

  const newAccount = await Account.create({
    email,
    accountName,
    website,
    appSecretToken: generateSecretToken(),
  });

  const accountData = newAccount.get();
  delete accountData.appSecretToken;

  res.status(StatusCodes.OK).json({
    status: "success",
    data: { account: accountData },
  });
});

// Get All Accounts
const getAllAccounts = catchAsync(async (req, res) => {
  const accounts = await Account.findAll({});
  res.json({
    status: "success",
    data: { accounts },
  });
});

// Get Single Account
const getAccount = catchAsync(async (req, res) => {
  const account = await Account.findByPk(req.params.id, {
    attributes: { exclude: ["appSecretToken"] },
  });
  if (!account) {
    throw new ApiError(404, "Account not found");
  }
  res.json({
    status: "success",
    data: { account },
  });
});

// Update Account
const updateAccount = catchAsync(async (req, res) => {
  const [updated] = await Account.update(req.body, {
    where: { id: req.params.id },
    returning: true,
    individualHooks: true,
  });

  if (!updated) {
    throw new ApiError(404, "Account not found");
  }

  const updatedAccount = await Account.findByPk(req.params.id, {
    attributes: { exclude: ["appSecretToken"] },
  });

  res.json({
    status: "success",
    data: { account: updatedAccount },
  });
});

const deleteAccount = catchAsync(async (req, res) => {
  const accountId = req.params.id;

  const account = await Account.findByPk(accountId);
  if (!account) {
    throw new ApiError(404, "Account not found");
  }

  await Destination.destroy({
    where: { accountId: accountId },
  });

  await account.destroy();

  res.status(204).json({
    status: "success",
    data: null,
  });
});

module.exports = {
  createAccount,
  getAllAccounts,
  getAccount,
  updateAccount,
  deleteAccount,
  generateSecretToken,
};
