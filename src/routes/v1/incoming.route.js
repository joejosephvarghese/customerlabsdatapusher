const express = require("express");
const { incomingdataController } = require("../../controllers");

const router = express.Router();

router.post('/incoming_data', 
  incomingdataController.handleIncomingData
);
module.exports = router;
