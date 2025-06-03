const express = require("express");
const { destinationController } = require("../../controllers");

const router = express.Router();

router.post(
  "/:accountId",
  destinationController.createDestination
);
router.get(
  "/:accountId",
  destinationController.getDestinationsForAccount
);

module.exports = router;
