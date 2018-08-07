//依赖管理
var path = require("path");
var express = require("express");
var debug = require("debug")("my-application"); // debug模块
var log4js = require("log4js"); //日志
var ejs = require("ejs");

var indexRouter = require("./routes/index");
var { log, logInfo, logError } = require("./bin/log");

var app = express();

//日志
app.use(log4js.connectLogger(log));
app.use(log4js.connectLogger(logInfo));
app.use(log4js.connectLogger(logError));

// 静态文件
app.use(express.static(path.join(__dirname, "views")));
app.set("views", __dirname + "views");
app.engine("html", ejs.__express);
app.set("view engine", "html");

// 路由
app.use("/", indexRouter);
app.get("/*", function(req, res, next) {
    res.sendFile(path.join(__dirname, "/views/index.html"));
});

var server = app.listen(80, function(err) {
    debug("Express server listening on port " + server.address().port);
});
