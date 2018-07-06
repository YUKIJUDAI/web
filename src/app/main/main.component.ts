import { Component, OnInit } from '@angular/core';

import { wow } from './wow';
import { CanvasParticle } from './canvas-particle';
import { web } from './webData';

declare var $: any;
@Component({
    selector: 'app-root',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
    address: object;
    addressArray: Array<object> = [];
    constructor() {
        this.address = new web().address;
        Object.keys(this.address).forEach((item, i) => {
            this.addressArray.push({
                name: item,
                url: this.address[item]
            })
        });
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
        new wow({}).init();
    }
}