const express = require("express");


const router = express.Router();

const accountRoute = require("./account.route");

const destinationRoute = require("./destination.route");

const defaultRoutes = [
 {
    path: "/accounts",
    route: accountRoute,
  },

   {
    path: "/destination",
    route: destinationRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
