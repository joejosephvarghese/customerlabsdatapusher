const express = require("express");


const router = express.Router();

const accountRoute = require("./account.route");

const destinationRoute = require("./destination.route");

const incomingRoute = require("./incoming.route");

const defaultRoutes = [
 {
    path: "/accounts",
    route: accountRoute,
  },

   {
    path: "/destination",
    route: destinationRoute,
  },

  {
    path: "/incoming_data",
    route: incomingRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
