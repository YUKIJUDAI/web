import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";

import { WebData } from "./webData";

@Component({
    selector: "app-main",
    templateUrl: "./main.component.html",
    styleUrls: ["./main.component.css"],
    providers: [WebData]
})
export class MainComponent implements OnInit {
    @ViewChild("intro")
    intro: ElementRef;
    // 网站列表
    address: Array<object> = [];
    constructor(private web: WebData) {
        this.address = this.web.address;
    }
    ngOnInit() {

    }
    // 模拟键盘按下声音
    keySound() {
        var audio = document.getElementsByTagName("audio")[0];
        audio.play();
    }
    // url跳转
    toUrl(i) {
        this.keySound();
        window.open(this.address[i]["url"]);
    }
}
