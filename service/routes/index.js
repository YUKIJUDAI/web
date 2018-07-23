var express = require("express");

var log = require("../log");
var db = require("../basicConnection");

var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
    res.write("hello world");
    log.info("hello world");
});

router.get("/getPhotoList", function(req, res, next) {
    db.query("SELECT * FROM web_photoList", function(err, data) {
        res.json(data);
    });
});

module.exports = router;
