import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { smoothScroll } from "smoothscroll";

import { wow } from "./wow";
import { CanvasParticle } from "./canvas-particle";
import { WebData } from "./webData";

declare var $: any;
@Component({
    selector: "app-root",
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
        // canvas背景
        new CanvasParticle();
        // 视觉差插件
        $("#home").parallax("100%", 0.3);
        // 固定nav插件
        $(".navbar-default").sticky({ topSpacing: 0 });
        // 动态文字插件
        new wow({}).init();
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
    // start 锚点跳转
    toStart(e) {
        e.preventDefault();
        smoothScroll(this.intro.nativeElement);
    }
}
