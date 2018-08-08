import { Component, ElementRef, ViewChild } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { interval, timer } from "rxjs/index";

import { environment } from "../../environments/environment";
import { Visualizer } from "./audio_visualizer";

@Component({
    selector: "music",
    templateUrl: "./music.component.html",
    styleUrls: ["./music.component.css"],
    providers: [Visualizer]
})
export class MusicComponent {
    @ViewChild("player") player: ElementRef;

    music_list: any = [{ src: "" }];
    play_index: number = 0;
    time: string = "00:00";
    flag: boolean = false;
    setInterval: any;
    constructor(private http: HttpClient, private visualizer: Visualizer) {
        this.http.get(environment.baseApi + "getMusicList").subscribe(res => {
            this.music_list = res;
            this.playMusic(0);
        });
    }
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
                this.forward();
            }
        });
    }
    clickBtnPlay() {
        if (this.flag) {
            this.flag = false;
            this.visualizer.stop();
        } else {
            this.visualizer.play(this.visualizer.getCurrentTime());
        }
    }
    backword() {
        if (this.play_index > 0) {
            this.visualizer.stop();
            this.playMusic(this.play_index - 1);
        } else {
            alert("没有上一首了");
        }
    }
    forward() {
        if (this.play_index < this.music_list.length - 1) {
            this.visualizer.stop();
            this.playMusic(this.play_index + 1);
        } else {
            alert("没有下一首了");
        }
    }
    formateTime(time) {
        var minute: string | number = Math.floor(time / 60);
        var second: string | number = Math.floor(time - 60 * minute);
        minute = minute >= 10 ? minute : "0" + minute;
        second = second >= 10 ? second : "0" + second;
        return minute + ":" + second;
    }
}
