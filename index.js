const express = require('express'),
      logger = require('./start_up/loggin')(__filename),
      app = express();

require('express-async-errors');
require('./start_up/routes')(app);
require('./start_up/db')();
require('./start_up/prod')(app);

app.listen(process.env.PORT, () => logger.info('express'));