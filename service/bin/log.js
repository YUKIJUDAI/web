var log4js = require("log4js"); 
var config = require("./config");

log4js.configure(config.logConfig);

var logger = log4js.getLogger("http");

module.exports = logger;