const express = require("express");


const router = express.Router();

const accountRoute = require("./account.route");

const defaultRoutes = [
 {
    path: "/accounts",
    route: accountRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
