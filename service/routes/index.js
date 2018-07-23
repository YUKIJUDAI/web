var express = require("express");

var log = require("../log");
var db = require("../basicConnection");

var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
    res.write("hello world");
    log.info('hello world')
});

router.get("/photo1", function(req, res, next) {
    res.write("hello world1111");
});

module.exports = router;
