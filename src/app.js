const express = require("express");
const helmet = require("helmet");
const { helmetConfig } = require("../src/config/config");
const routes = require("./routes/v1");
const logger = require("./config/logger");
const { StatusCodes } = require("http-status-codes");
const ApiError = require("./utils/apiError");
const { errorConverter, errorHandler } = require("../src/middleware/error");
const setupSwagger = require("../src/swagger");
const  sequelize = require("./model/connection"); // Import from models

const app = express();

app.use(helmet(helmetConfig));
app.use(express.json());

// Database connection and sync
sequelize.authenticate()
  .then(() => {
    logger.info("Connected to SQLite database");
    return sequelize.sync({ force: true }); // Use force:true to recreate tables
  })
  .then(() => logger.info("Database tables created"))
  .catch((err) => {
    logger.error("Database error:", err);
    process.exit(1); // Exit if DB connection fails
  });

setupSwagger(app);
app.use("/v1", routes);

app.use((req, res, next) => {
  next(new ApiError(StatusCodes.NOT_FOUND, "Not found"));
});

app.use(errorConverter);
app.use(errorHandler);

module.exports = app;