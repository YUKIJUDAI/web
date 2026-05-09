import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { RouterOutlet, RouterLink } from "@angular/router";
import smoothScroll from "smoothscroll";

import { CanvasParticle } from "./component/home/canvas-particle";
import { wow } from "./component/home/wow";

declare var $: any;

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  providers: [CanvasParticle],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  @ViewChild("intro")
  intro!: ElementRef;

  constructor(canvasParticle: CanvasParticle) {
    canvasParticle.canvasInit();
  }

  ngOnInit() {
    $("#home").parallax("100%", 0.3);
    $(".navbar-default").sticky({ topSpacing: 0 });
    new wow({}).init();
  }

  toStart(e: Event) {
    e.preventDefault();
    smoothScroll(this.intro.nativeElement);
  }
}
