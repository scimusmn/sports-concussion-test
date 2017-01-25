/**
 *
 * logger.js
 *
 * Logging accessible from client and server.
 * Relies on Winston.js (https://github.com/winstonjs/winston)
 *
 * Use this singleton instance of logger like so:
 *
 * // import logger from '../modules/logger';
 * // logger.info({message:'event-message', anyData:'My useful data', moreData:12345});
 *
 * Timestamps are appended by default.
 *
 * Log files can be found at:
 * <project-root>/.meteor/local/build/programs/server/logs/
 *
 */

let logDirectory = 'logs';
let logger;

if(Meteor.isServer) {

  import winston from 'winston';
  import fs from 'fs';
  import { check } from 'meteor/check';

  winston.setLevels(winston.config.npm.levels);
  winston.addColors(winston.config.npm.colors);

  if (fs.existsSync(logDirectory) == false) {
    // Create the directory if it does not exist
    fs.mkdirSync(logDirectory);
  }

  logger = new(winston.Logger)({
    transports: [
      new winston.transports.File({
        filename: logDirectory + '/log-'+(new Date().toISOString())+'.log',
        maxsize: 1024 * 1024 * 10, // 10MB
      }),
      ],
    exitOnError: false, // Do not exit logger if error is encountered
  });

  Meteor.methods({

    logDebug: function(data) {
      check(data, Object);
      logger.debug(data);
    },
    logInfo: function(data) {
      check(data, Object);
      logger.info(data);
    },
    logWarn: function(data) {
      check(data, Object);
      logger.warn(data);
    },
    logError: function(data) {
      check(data, Object);
      logger.error(data);
    },

  });

}

/*
 * Call logger functions
 * from client side
 */
if(Meteor.isClient) {

  logger = {
    debug: function(data) {
      Meteor.call('logDebug', data);
    },
    info: function(data) {
      Meteor.call('logInfo', data);
    },
    warn: function(data) {
      Meteor.call('logWarn', data);
    },
    error: function(data) {
      Meteor.call('logError', data);
    },
  };

}

module.exports = logger;
