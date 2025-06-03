const express = require("express");
const { destinationController } = require("../../controllers");

const router = express.Router();

router.post("/:accountId/destinations", destinationController.createDestination);
router.get("/:accountId/destinations", destinationController.getDestinationsForAccount);

module.exports = router;
