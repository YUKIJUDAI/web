import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { CommonModule } from "@angular/common";

import { WebData } from "./webData";

@Component({
    selector: "app-main",
    standalone: true,
    imports: [CommonModule],
    templateUrl: "./main.component.html",
    styleUrls: ["./main.component.css"],
    providers: [WebData]
})
export class MainComponent implements OnInit {
    @ViewChild("intro")
    intro!: ElementRef;

    address: Array<any> = [];

    constructor(private web: WebData) {
        this.address = this.web.address;
    }

    ngOnInit() {}

    keySound() {
        const audio = document.getElementsByTagName("audio")[0];
        audio.play();
    }

    toUrl(i: number) {
        this.keySound();
        window.open(this.address[i]["url"]);
    }
}
