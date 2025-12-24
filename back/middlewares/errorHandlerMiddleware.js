const logger = require("../logger/logger");

const errorHandler = (err, req, res, next) => {
  const statusCode = Number(err.statusCode) || Number(err.status) || 500;
  const status = typeof err.status === 'string' ? err.status : (statusCode >= 500 ? 'error' : 'fail');

  logger.error(`ERROR ${statusCode} - ${req.method} - ${status} - ${err.message || err} - IP: ${req.ip}`);
  logger.error(err.stack || '');

  res.status(statusCode).json({
    status,
    message: err.message || 'Internal Server Error',
  });
};

module.exports = errorHandler;