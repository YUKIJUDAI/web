var path = require("path");
var fs = require("fs");
var express = require("express");
var bodyParser = require("body-parser");
var jsmediatags = require("jsmediatags"); // mp3读取

var db = require("../bin/basicConnection");
var createWebAPIRequest = require("../util/util");
var { log, logInfo, logError } = require("../bin/log");

var router = express.Router();

// bodyParser
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

//允许跨域
router.all("*", function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
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
                        title: item.split(".")[0],
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

router.post("/searchMusic", function(req, res, next) {
    const data = {
        csrf_token: "",
        limit: req.body.limit || 50,
        type: req.body.type || 1,
        s: req.body.search || "",
        offset: req.body.offset || 0
    };
    createWebAPIRequest(
        "music.163.com",
        "/weapi/search/get",
        "POST",
        data,
        "",
        music_req => res.json(JSON.parse(music_req)),
        err => res.status(502).send("fetch error")
    );
});

router.post("/playSearchMusic", function(req, res, next) {
    const data = {
        ids: [req.body.id],
        br: req.body.br || 999000,
        csrf_token: ""
    };
    createWebAPIRequest(
        "music.163.com",
        "/weapi/song/enhance/player/url",
        "POST",
        data,
        "",
        music_req => {
            res.setHeader("Content-Type", "application/json");
            res.send(music_req);
        },
        err => {
            res.status(502).send("fetch error");
        }
    );
});

module.exports = router;
