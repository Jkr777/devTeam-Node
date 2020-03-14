const { createLogger, format, transports } = require('winston');
const path = require('path'); 

const logger = caller => {
  return createLogger({
    level: 'debug',
    format: format.combine(
      format.label({ label: path.basename(caller)}),
      format.colorize(),
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.printf(
        info =>
          `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
      )
    ),
    transports: [
      new transports.Console(),
      new transports.File({ filename: 'error.log', level: 'error' }),
      new transports.File({ filename: 'combined.log' })
    ], 
    exceptionHandlers: [
      new transports.Console(),
      new transports.File({ filename: 'exceptions.log' })
    ] 
  });
};

module.exports = logger;