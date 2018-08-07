var path = require("path");
var fs = require("fs");
var express = require("express");
var bodyParser = require("body-parser");
var jsmediatags = require("jsmediatags"); // mp3读取


var db = require("../bin/basicConnection");
var { log, logInfo, logError } = require("../bin/log");

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
    // 数据库
    // db.query("SELECT * FROM web_photoList", function(err, data) {
    //     res.json(data);
    // });
    res.json([
        {
            url: "assets/images/photo/youxi.jpg",
            h4txt: "Mutou Yūgi",
            content: "To have a dream, Even if far away"
        },
        {
            url: "assets/images/photo/shidai.jpg",
            h4txt: "Yuki Judai",
            content: "To have a dream, Even if far away"
        },
        {
            url: "assets/images/photo/youxin.jpg",
            h4txt: "Fudo Yusei",
            content: "To have a dream, Even if far away"
        }
    ]);
});

router.get("/getMusicList", function(req, res, next) {
    var p = path.resolve(__dirname, "../views/assets/sound/music/");
    var data = [];
    fs.readdir(p, function(err, files) {
        files.forEach(function(item, i) {
            jsmediatags.read(p + "/" + item, {
                onSuccess: function(tag) {
                    data.push({
                        title: item,
                        artist: tag.tags.artist,
                        src: "../../assets/sound/music/" + item
                    });
                    if (i === files.length - 1) {
                        res.json(data);
                    }
                }
            });
        });
    });
});

module.exports = router;
