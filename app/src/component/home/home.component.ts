import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { smoothScroll } from "smoothscroll";

import { wow } from "./wow";
import { CanvasParticle } from "./canvas-particle";

declare var $: any;
@Component({
    selector: "app-root",
    providers: [CanvasParticle],
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
    @ViewChild("intro")
    intro: ElementRef;
    constructor(canvasParticle: CanvasParticle) {
        // canvas背景
        canvasParticle.canvasInit({});
    }
    ngOnInit() {
        // 视觉差插件
        $("#home").parallax("100%", 0.3);
        // 固定nav插件
        $(".navbar-default").sticky({ topSpacing: 0 });
        // 动态文字插件
        new wow({}).init();
    }
    // start 锚点跳转
    toStart(e) {
        e.preventDefault();
        smoothScroll(this.intro.nativeElement);
    }
}
