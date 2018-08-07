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
            type: "console",
            category: "console"
        },
        info: {
            type: "dateFile",
            filename: "logs/app-info.log",
            pattern: ".yyyy-MM-dd",
            category: "console"
        },
        error: {
            type: "dateFile",
            filename: "logs/app-error.log",
            pattern: ".yyyy-MM-dd"
        }
    },
    replaceConsole: true,
    categories: {
        default: {
            appenders: ["console"],
            level: "all"
        },
        info: {
            appenders: ["info"],
            level: "info"
        },
        error: {
            appenders: ["error"],
            level: "error"
        }
    }
};

module.exports = {
    mysqlConfig: mysqlConfig,
    logConfig: logConfig
};
