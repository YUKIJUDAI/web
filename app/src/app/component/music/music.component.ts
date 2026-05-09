import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { interval, forkJoin, Subscription } from "rxjs";

import { environment } from "../../environments/environment";
import { Visualizer } from "./audio_visualizer";

declare var $: any;

@Component({
    selector: "music",
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: "./music.component.html",
    styleUrls: ["./music.component.css"],
    providers: [Visualizer]
})
export class MusicComponent implements AfterViewInit, OnDestroy {
    music_list: any = [];
    lyric_list: any = [];
    lyric_index: number = 0;
    play_index: number = 0;
    time: string = "00:00";
    flag: boolean = false;
    first: boolean = true;
    tabflag: boolean = false;
    setInterval!: Subscription;
    searchContent: string = "";
    searchList: Array<any> = [];

    constructor(private http: HttpClient, private visualizer: Visualizer) {}

    ngAfterViewInit() {}

    ngOnDestroy() {
        this.visualizer.close();
    }

    playMusic(i: number) {
        this.play_index = i;
        this.flag = !this.flag;
        this.first = false;
        this.lyric_index = 0;
        this.lyric_list = this.music_list[i].lyric;
        this.visualizer.start(this.music_list[i].src);
        this.setInterval = interval(1000).subscribe(() => {
            this.time = this.formateTime(this.visualizer.getCurrentTime());
            for (let i = this.lyric_index; i < this.lyric_list.length; i++) {
                if (this.lyric_list[i].time === this.time) {
                    this.lyric_index = i;
                }
            }
            if (this.visualizer.getCurrentTime() > 0 && this.visualizer.getDuration() > 0 && this.visualizer.getCurrentTime() >= this.visualizer.getDuration()) {
                this.setInterval.unsubscribe();
                this.next();
            }
        });
    }

    clickBtnPlay() {
        if (this.music_list.length === 0) {
            return;
        }
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

    prev() {
        this.visualizer.stop();
        this.play_index > 0 ? this.playMusic(this.play_index - 1) : this.playMusic(this.music_list.length - 1);
    }

    next() {
        this.visualizer.stop();
        this.play_index < this.music_list.length - 1 ? this.playMusic(this.play_index + 1) : this.playMusic(0);
    }

    formateTime(time: number): string {
        let minute: string | number = Math.floor(time / 60);
        let second: string | number = Math.floor(time - 60 * minute);
        minute = minute >= 10 ? minute : "0" + minute;
        second = second >= 10 ? second : "0" + second;
        return minute + ":" + second;
    }

    changeTab() {
        this.tabflag = !this.tabflag;
        if (this.tabflag) {
            $(".music_menu").animate({ width: "300px" });
        } else {
            $(".music_menu").animate({ width: "60px" });
        }
    }

    search(e: KeyboardEvent) {
        if (e.keyCode == 13) {
            const content = this.searchContent;
            this.searchContent = "搜索中。。。";
            this.http.post(environment.baseApi + "searchMusic", { search: content }).subscribe((res: any) => {
                this.searchContent = content;
                this.searchList = res["result"]["songs"];
            });
        }
    }

    addPlayMusic(index: number, id: number) {
        const msg = this.http.post(environment.baseApi + "playSearchMusic", { id });
        const lyric = this.http.post(environment.baseApi + "getLyric", { id });
        forkJoin([msg, lyric]).subscribe((res: any) => {
            let lyricList: any[] = [];
            const item: any = this.searchList[index];
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
        });
    }

    changeLyric(lyric: string): Array<object> {
        const arr: Array<string> = JSON.stringify(lyric).split("\\n");
        const lyricList: Array<object> = [];
        arr.forEach((item, i) => {
            lyricList.push({
                time: item.substring(item.indexOf("[") + 1, item.indexOf("]")).split(".")[0],
                content: item.substring(item.indexOf("]") + 1)
            });
        });
        return lyricList;
    }
}
