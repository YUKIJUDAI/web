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
    @ViewChild("process") process: ElementRef;
    @ViewChild("processSlide") process_slide: ElementRef;

    music_list: any = [{ src: "" }];
    play_index: number = 0;
    time: string = "00:00";
    flag: boolean = false;
    setInterval: any;
    constructor(private http: HttpClient, private visualizer: Visualizer) {
        this.http.get(environment.baseApi + "getMusicList").subscribe(res => {
            this.music_list = res;
        });
    }
    playMusic(i) {
        this.play_index = i;
        this.flag = true;
        this.visualizer.ini();
        timer(100).subscribe(() => {
            this.player.nativeElement.play();
        });
        this.setInterval = interval(100).subscribe(() => {
            this.time = this.formateTime(this.player.nativeElement.currentTime);
            var percent = this.player.nativeElement.currentTime / this.player.nativeElement.duration;
            this.process_slide.nativeElement.style.width = percent * 100 + "%";
            if (this.player.nativeElement.ended) {
                this.setInterval.unsubscribe();
                this.forward();
            }
        });
    }
    clickBtnPlay() {
        if (this.player.nativeElement.paused) {
            this.playMusic(this.play_index);
        } else {
            this.flag = false;
            this.player.nativeElement.pause();
            this.setInterval.unsubscribe();
        }
    }
    backword() {
        this.play_index > 0 ? this.playMusic(this.play_index - 1) : alert("没有上一首了");
    }
    forward() {
        this.play_index < this.music_list.length - 1 ? this.playMusic(this.play_index + 1) : alert("没有下一首了");
    }
    formateTime(time) {
        var minute: string | number = Math.floor(time / 60);
        var second: string | number = Math.floor(time - 60 * minute);
        minute = minute >= 10 ? minute : "0" + minute;
        second = second >= 10 ? second : "0" + second;
        return minute + ":" + second;
    }
    toProcess(event) {
        var currentValue = event.offsetX / this.process.nativeElement.offsetWidth;
        this.player.nativeElement.currentTime = this.player.nativeElement.duration * currentValue;
    }
}
