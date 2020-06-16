const winston = require('winston');
require('winston-daily-rotate-file');

const moment = require('moment');

winston.level = 'debug';

const LOG_FILE_PATH = '/var/bpmn.log';

const formatter = options => {
  return [
    moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
    options.level.toUpperCase(),
    options.message
  ].join(' ');
};

const winstonLogger = winston.createLogger({
  level: 'info',
  transport: (()=> {
    let transports = [];
    if(global.running === 'marathon') {
      transports.push(
        new winston.transport.DailyRotateFile({
          name: 'rotated-log'
          , level: 'fatal'
          , filename: LOG_FILE_PATH + '-%DATE%.log'
          , datePattern: 'YYYY-MM-DD'
          , localTime: true
          , format: winston.format.printf(formatter)
          , maxSize: '3g'
          , maxFiles: '7d'
        })
      );
    }
    transports.push(
      new winston.transports.Console({
        name: 'console'
        , lebel: 'info'
        , format: winston.format.printf(formatter)
      })
    );
    
    return transports;
  })()
});

function errorLog(... msg) {
  winstonLogger.log('error', msg.join(' '));
}

function debugLog(... msg) {
  winstonLogger.log('debug', msg.join(' '));
}

function warnLog(... msg) {
  winstonLogger.log('warn', msg.join(' '));
}

function infoLog(... msg) {
  winstonLogger.log('info', msg.join(' '));
}

module.exports = {
  info: infoLog
  , debug: debugLog
  , warn: warnLog
  , error: errorLog
}