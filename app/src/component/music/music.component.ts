import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { interval } from "rxjs/index";

import { environment } from "../../environments/environment";
import { Visualizer } from "./audio_visualizer";

declare var $: any;
@Component({
    selector: "music",
    templateUrl: "./music.component.html",
    styleUrls: ["./music.component.css"],
    providers: [Visualizer]
})
export class MusicComponent implements AfterViewInit,OnDestroy {
    @ViewChild("player")
    player: ElementRef;

    music_list: any = []; //音乐列表
    play_index: number = 0; // 当前index
    time: string = "00:00"; // 当前播放时间
    flag: boolean = false;  // 当前是否在播放
    first: boolean = true; // 是否第一次播放
    tabflag: boolean = false; // 搜索tab是否打开
    setInterval: any;    // interval observable
    searchContent: string = ""; // 搜索内容
    searchList: Array<object>; //搜索列表
    constructor(private http: HttpClient, private visualizer: Visualizer) {
        this.http.get(environment.baseApi + "getMusicList").subscribe(res => {
            this.music_list = res;
        });
    }
    ngAfterViewInit() {}
    ngOnDestroy(){
        // close播放器对象
        this.visualizer.close();
    }
    // 播放音乐
    playMusic(i) {
        this.play_index = i;
        this.flag = true;
        this.visualizer.start(this.music_list[i].src);
        this.setInterval = interval(100).subscribe(() => {
            this.time = this.formateTime(this.visualizer.getCurrentTime());
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
            this.flag = false;
            this.visualizer.stop();
        } else {
            this.flag = true;
            if (this.first) {
                this.first = !this.first;
                this.playMusic(0);
            } else {
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
    addPlayMusic(id) {
        this.http.post(environment.baseApi + "playSearchMusic", { id: id }).subscribe(res => {
            this.searchList.forEach((item, i) => {
                if (item["id"] === id) {
                    this.music_list.push({
                        artist: item["artists"][0].name,
                        src: res["data"][0].url,
                        title: item["name"]
                    });
                    this.playMusic(this.music_list.length - 1);
                    return;
                }
            });
        });
    }
}
