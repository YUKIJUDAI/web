//依赖管理
var express = require("express");
var bodyParser = require("body-parser");
var debug = require("debug")("my-application"); // debug模块
var log4js = require("log4js"); //日志

var indexRouter = require("../routes/index");
var log = require("../log");

var app = express();

//日志
app.use(log4js.connectLogger(log, { level: "trace" }));

// bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//允许跨域
app.all("*", function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", " 3.2.1");
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

// 路由
app.use("/", indexRouter);

// 错误提示
app.use(function(req, res, next) {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

var server = app.listen(8081, function(err) {
    debug("Express server listening on port " + server.address().port);
});
