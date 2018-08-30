import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { interval, forkJoin } from "rxjs/index";

import { environment } from "../../environments/environment";
import { Visualizer } from "./audio_visualizer";

declare var $: any;
@Component({
    selector: "music",
    templateUrl: "./music.component.html",
    styleUrls: ["./music.component.css"],
    providers: [Visualizer]
})
export class MusicComponent implements AfterViewInit, OnDestroy {
    music_list: any = [
        {
            title: "千秋此意",
            artist: "司夏",
            src: "../../assets/sound/music/千秋此意.mp3",
            lyric:
                "[by:汐音社]\n[ar:司夏]\n[ti:千秋此意]\n[00:00.00] 作曲 : 潇梦临\n[00:01.00] 作词 : 乘物游心\n[00:18.26]我曾借明月当头\n[00:22.01]寻得某个人\n[00:23.86]点漆眼眸\n[00:25.98]相对落座山口\n[00:28.28]无茶亦无酒\n[00:34.42]他含笑说些春秋\n[00:37.88]奉与这一生\n[00:39.78]微澜缘由\n[00:41.92]低眉抛置枯愁\n[00:44.25]江海行扁舟\n[00:49.88]高处风情万种\n[00:51.98]衣角都辉荣\n[00:53.93]最终不过多添个失意面孔\n[00:59.18]你是山下兰芽\n[01:01.64]梦遍西风白发\n[01:03.50]萧瑟年月赏作温柔晩霞\n[01:07.57]枕些无主杨花\n[01:09.52]趁着倦意睡下\n[01:11.37]千里外应有\n[01:13.12]天星清辉满洒\n[01:15.42]你是飞鸿雪花\n[01:17.47]写遍倦客思家\n[01:19.42]萧瑟年月多少书信不达\n[01:23.37]偶遇风波故人\n[01:25.47]向来擦肩无话\n[01:27.38]后来无谁看\n[01:28.99]东栏新雪梅花\n[01:52.16]待中宵风露渐浓\n[01:55.53]他复又提起\n[01:57.48]微芒灯笼\n[01:59.57]而我未曾挽留\n[02:02.09]垂眸一拱手\n[02:07.56]敬揖造化赠我\n[02:09.41]这人间相逢\n[02:11.49]转身竹杖芒鞋与烟雨相拥\n[02:16.95]你是千岁闲暇\n[02:19.34]无须悲欢作答\n[02:21.36]萧瑟年月也作锦上添花\n[02:25.32]来饰杯身青纹\n[02:27.31]悠闲生火烹茶\n[02:29.26]将千里行云\n[02:30.86]一并痛快饮下\n[02:33.18]你是柴门冬夏\n[02:35.18]也曾高轩风雅\n[02:37.25]萧瑟年月催人多习潇洒\n[02:41.17]料峭春风吹醒\n[02:43.07]悠长诗酒生涯\n[02:45.27]一梦任江山\n[02:46.72]胜过白马\n[02:50.80]你是千岁闲暇\n[02:53.04]无须悲欢作答\n[02:55.09]萧瑟年月也作锦上添花\n[02:59.18]来饰杯身青纹\n[03:01.08]悠闲生火烹茶\n[03:03.08]将千里行云\n[03:04.73]一并痛快饮下\n[03:07.08]你是柴门冬夏\n[03:08.93]也曾高轩风雅\n[03:11.08]萧瑟年月催人多习潇洒\n[03:15.03]料峭春风吹醒\n[03:17.14]悠长诗酒生涯\n[03:19.04]一梦任江山\n[03:20.74]胜过轻舟白马\n"
        }
    ]; //音乐列表
    lyric_list: any = []; // 当前歌词list
    lyric_index: number = 0; // 当前歌词list的index
    play_index: number = 0; // 当前index
    time: string = "00:00"; // 当前播放时间
    flag: boolean = false; // 当前是否在播放
    first: boolean = true; // 是否第一次播放
    tabflag: boolean = false; // 搜索tab是否打开
    setInterval: any; // interval observable
    searchContent: string = ""; // 搜索内容
    searchList: Array<object>; //搜索列表
    constructor(private http: HttpClient, private visualizer: Visualizer) {
        this.lyric_list = this.music_list[0].lyric = this.changeLyric(this.music_list[0].lyric);
    }
    ngAfterViewInit() {}
    ngOnDestroy() {
        // close播放器对象
        this.visualizer.close();
    }
    // 播放音乐
    playMusic(i) {
        this.play_index = i;
        this.flag = !this.flag;
        this.first = false;
        this.lyric_index = 0;
        this.visualizer.start(this.music_list[i].src);
        this.setInterval = interval(1000).subscribe(() => {
            this.time = this.formateTime(this.visualizer.getCurrentTime());
            for (let i = this.lyric_index; i < this.lyric_list.length; i++) {
                if (this.lyric_list[i].time === this.time) {
                    this.lyric_index = i;
                }
            }
            if (
                this.visualizer.getCurrentTime() > 0 &&
                this.visualizer.getDuration() > 0 &&
                this.visualizer.getCurrentTime() >= this.visualizer.getDuration()
            ) {
                this.setInterval.unsubscribe();
                this.next();
            }
        });
    }
    // 按钮播放音乐
    clickBtnPlay() {
        if (this.flag) {
            this.flag = !this.flag;
            this.visualizer.stop();
        } else {
            if (this.first) {
                this.first = !this.first;
                this.playMusic(0);
            } else {
                this.flag = !this.flag;
                this.visualizer.play(this.visualizer.getCurrentTime());
            }
        }
    }
    // 上一首
    prev() {
        if (this.play_index > 0) {
            this.visualizer.stop();
            this.playMusic(this.play_index - 1);
        } else {
            this.setInterval.unsubscribe();
            alert("没有上一首了");
        }
    }
    // 下一首
    next() {
        if (this.play_index < this.music_list.length - 1) {
            this.visualizer.stop();
            this.playMusic(this.play_index + 1);
        } else {
            this.setInterval.unsubscribe();
            alert("没有下一首了");
        }
    }
    // 处理时间
    formateTime(time) {
        var minute: string | number = Math.floor(time / 60);
        var second: string | number = Math.floor(time - 60 * minute);
        minute = minute >= 10 ? minute : "0" + minute;
        second = second >= 10 ? second : "0" + second;
        return minute + ":" + second;
    }
    // 改变搜索tab状态
    changeTab() {
        this.tabflag = !this.tabflag;
        if (this.tabflag) {
            $(".music_menu").animate({ width: "300px" });
        } else {
            $(".music_menu").animate({ width: "60px" });
        }
    }
    // 搜索
    search(e) {
        if (e.keyCode == "13") {
            var content = this.searchContent;
            this.searchContent = "搜索中。。。";
            this.http.post(environment.baseApi + "searchMusic", { search: content }).subscribe(res => {
                this.searchContent = content;
                this.searchList = res["result"]["songs"];
            });
        }
    }
    // 添加网络音乐并播放
    addPlayMusic(index, id) {
        var msg = this.http.post(environment.baseApi + "playSearchMusic", { id });
        var lyric = this.http.post(environment.baseApi + "getLyric", { id });
        forkJoin([msg, lyric]).subscribe(res => {
            let lyricList = [],
                item = this.searchList[index];
            if (!res[1]["nolyric"]) {
                lyricList = this.changeLyric(res[1]["lrc"].lyric);
                this.lyric_list = lyricList;
            }
            this.music_list.push({
                artist: item["artists"][0].name,
                src: res[0]["data"][0].url,
                title: item["name"],
                lyric: lyricList
            });

            this.playMusic(this.music_list.length - 1);
            return;
        });
    }
    // 处理歌词
    changeLyric(lyric): Array<object> {
        let arr: Array<string> = JSON.stringify(lyric).split("\\n");
        let lyricList: Array<object> = [];
        arr.forEach((item, i) => {
            lyricList.push({
                time: item.substring(item.indexOf("[") + 1, item.indexOf("]")).split(".")[0],
                content: item.substring(item.indexOf("]") + 1)
            });
        });
        return lyricList;
    }
}
