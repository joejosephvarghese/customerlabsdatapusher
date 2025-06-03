const express = require("express");
const { accountController } = require("../../controllers");

const router = express.Router();

router.post("/register", accountController.createAccount);
router.get("/getall", accountController.getAllAccounts);

module.exports = router;
