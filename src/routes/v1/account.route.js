const express = require("express");
const {
  accountController,
  destinationController,
} = require("../../controllers");

const router = express.Router();
// Account Routes
router.post("/", accountController.createAccount);
router.get("/", accountController.getAllAccounts);
router.get("/:id", accountController.getAccount);
router.patch("/:id", accountController.updateAccount);
router.delete("/:id", accountController.deleteAccount);

module.exports = router;
