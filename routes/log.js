const log4js = require('log4js');
log4js.configure({
    appenders: {
        Ace: {
            type: "file",
            filename: "../log/app.log",
            maxLogSize: 10485760,
            numBackups: 3
        },
        errorFile: {
            type: "file",
            filename: "../log/errors.log"
        },
        errors: {
            type: "logLevelFilter",
            level: "ERROR",
            appender: "errorFile"
        }
    },
    categories: {
        default: { appenders: [ "Ace", "errors" ], "level": "DEBUG" }
    }
});

const log = log4js.getLogger('Ace');
module.exports = log;