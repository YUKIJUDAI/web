var log4js = require("log4js");
var config = require("./config");

log4js.configure(config.logConfig);

var log = log4js.getLogger();
var logInfo = log4js.getLogger("info");
var logError = log4js.getLogger("error");

module.exports = { log, logInfo, logError };
