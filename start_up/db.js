const mongoose = require('mongoose'),
      logger = require('./loggin')(__filename);

module.exports = () => {
  mongoose.connect(process.env.TEAM_DEV, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false })
    .then(() => logger.info("mongoDB"))
    .catch(err => logger.error(err))
};