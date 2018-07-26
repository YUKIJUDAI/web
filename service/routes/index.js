var express = require("express");
var bodyParser = require("body-parser");

var log = require("../bin/log");
var db = require("../bin/basicConnection");

var router = express.Router();


// bodyParser
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

//允许跨域
router.all("*", function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", " 3.2.1");
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

router.get("/getPhotoList", function(req, res, next) {
    db.query("SELECT * FROM web_photoList", function(err, data) {
        res.json(data);
    });
});

module.exports = router;
