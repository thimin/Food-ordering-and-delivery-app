const { StatusCodes } = require("http-status-codes");
const logger = require("./logger");

module.exports = (err, req, res, next) => {
  logger.error(`Error: ${err.message}`);

  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    error: {
      status: statusCode,
      message: message,
    },
  });
};