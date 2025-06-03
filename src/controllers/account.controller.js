const catchAsync = require("../utils/catchAsync");
const { Account } = require("../model");
const { StatusCodes } = require("http-status-codes");
const ApiError = require("../utils/apiError");
const crypto = require("crypto");
const sequelize = require("../model/connection");

const generateAccountId = () => `acc_${crypto.randomBytes(8).toString("hex")}`;
const generateSecretToken = () =>
  `tok_${crypto.randomBytes(16).toString("hex")}`;

// Create Account
exports.createAccount = catchAsync(async (req, res) => {
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
    accountId: generateAccountId(),
    appSecretToken: generateSecretToken(),
  });

  const accountData = newAccount.get();
  delete accountData.appSecretToken;

  res.status(201).json({
    status: "success",
    data: { account: accountData },
  });
});

// Get All Accounts
exports.getAllAccounts = catchAsync(async (req, res) => {
  const accounts = await Account.findAll({});
  res.json({
    status: "success",
    data: { accounts },
  });
});

// Get Single Account
exports.getAccount = catchAsync(async (req, res) => {
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
exports.updateAccount = catchAsync(async (req, res) => {
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

// Delete Account
exports.deleteAccount = catchAsync(async (req, res) => {
  const deleted = await Account.destroy({
    where: { id: req.params.id },
  });

  if (!deleted) {
    throw new ApiError(404, "Account not found");
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
