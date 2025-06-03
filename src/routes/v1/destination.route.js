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

router.get(
  "/destinations/:destinationId",
  destinationController.getDestination
);


router.patch(
  "/destinations/:destinationId",
  destinationController.updateDestination
);

router.delete(
  "/destinations/:destinationId",
  destinationController.deleteDestination
);
module.exports = router;
