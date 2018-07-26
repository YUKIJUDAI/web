var mysql = require("mysql");
var yargs = require("yargs");

var env = yargs.env;

var mysqlConfig = {
    host: "127.0.0.1",
    user: "root",
    password: "000000",
    database: "web",
    port: 3306
};

var logConfig = {
    appenders: {
        console: {
            type: "console"
        },
        trace: {
            type: "file",
            filename: "logs/access.log",
            "maxLogSize ": 31457280
        },
        http: {
            type: "logLevelFilter",
            appender: "trace",
            level: "trace",
            maxLevel: "trace"
        },
        info: {
            type: "dateFile",
            filename: "logs/app-info.log",
            pattern: ".yyyy-MM-dd",
            layout: {
                type: "pattern",
                pattern: "[%d{ISO8601}][%5p  %z  %c] %m"
            },
            compress: true
        },
        maxInfo: {
            type: "logLevelFilter",
            appender: "info",
            level: "debug",
            maxLevel: "info"
        },
        error: {
            type: "dateFile",
            filename: "logs/app-error.log",
            pattern: ".yyyy-MM-dd",
            layout: {
                type: "pattern",
                pattern: "[%d{ISO8601}][%5p  %z  %c] %m"
            },
            compress: true
        },
        minError: {
            type: "logLevelFilter",
            appender: "error",
            level: "error"
        }
    },
    categories: {
        default: {
            appenders: ["console", "http", "maxInfo", "minError"],
            level: "all"
        }
    }
};

module.exports = {
    mysqlConfig: mysqlConfig,
    logConfig: logConfig
};
