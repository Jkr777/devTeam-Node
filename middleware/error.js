const logger = require('../start_up/loggin')(__filename);

module.exports = (err, req, res, next) => {
  logger.error(err.message);
  res.status(500).send("Something failed");
};