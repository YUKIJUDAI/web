import { Component, OnInit } from '@angular/core';
import { CanvasParticle } from './canvas-particle';
import { web } from './webData';

declare var $: any;
@Component({
    selector: 'app-root',
    templateUrl: './main.component.html'
})

export class MainComponent implements OnInit {
    address: object;
    constructor() {
        this.address = new web().address;
        window.onkeyup = (event) => {
            this.toUrl(String.fromCharCode(event.keyCode))
        }
    }
    keySound() {
        var audio = document.getElementsByTagName('audio')[0];
        audio.play();
    }
    toUrl(id) {
        this.keySound();
        if (this.address[id] !== 'void 0' && this.address[id] !== undefined) {
            window.open(this.address[id]);
        }
    }

    ngOnInit() {
        new CanvasParticle();
        $('#home').parallax("100%", 0.3);
        $.localScroll({ filter: '.smoothScroll' });
        $(".navbar-default").sticky({
            topSpacing: 0
        });
    }
}