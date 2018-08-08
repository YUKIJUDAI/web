import { Injectable } from "@angular/core";

@Injectable()
export class Visualizer {
    audioContext;
    source = null;
    animationId;
    status = 0;
    forceStop = false;
    allCapsReachBottom = false;
    constructor() {
        this.audioContext = new AudioContext();
    }
    ini() {
        if (this.audioContext === null) {
            return;
        }
        if (this.status === 1) {
            this.forceStop = true;
        }
        this._start();
    }
    _start() {
        var that = this;
        function loadSound(url) {
            var request = new XMLHttpRequest();
            request.open("GET", url, true);
            request.responseType = "arraybuffer";
            request.onload = function() {
                that.audioContext.decodeAudioData(request.response, function(buffer) {
                    that._visualize(that.audioContext, buffer);
                });
            };
            request.send();
        }
        loadSound("../../assets/sound/music/千秋此意.mp3");
    }
    _visualize(audioContext, buffer) {
        var audioBufferSouceNode = audioContext.createBufferSource(),
            analyser = audioContext.createAnalyser(),
            that = this;
        audioBufferSouceNode.connect(analyser);
        analyser.connect(audioContext.destination);
        audioBufferSouceNode.buffer = buffer;
        if (!audioBufferSouceNode.start) {
            audioBufferSouceNode.start = audioBufferSouceNode.noteOn;
            audioBufferSouceNode.stop = audioBufferSouceNode.noteOff;
        }
        if (this.animationId !== null) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.source !== null) {
            this.source.stop(0);
        }
        audioBufferSouceNode.start(0);
        this.status = 1;
        this.source = audioBufferSouceNode;
        audioBufferSouceNode.onended = function() {
            that._audioEnd();
        };
        this._drawSpectrum(analyser);
    }
    _drawSpectrum(analyser) {
        var that = this,
            canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("canvas"),
            cwidth = canvas.width,
            cheight = canvas.height - 2,
            meterWidth = 10,
            gap = 2,
            capHeight = 2,
            capStyle = "#fff",
            meterNum = 800 / (10 + 2),
            capYPositionArray = [];
        var ctx = canvas.getContext("2d"),
            gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(1, "#0f0");
        gradient.addColorStop(0.5, "#ff0");
        gradient.addColorStop(0, "#f00");
        var drawMeter = function() {
            var array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(array);
            if (that.status === 0) {
                for (var i = array.length - 1; i >= 0; i--) {
                    array[i] = 0;
                }
                that.allCapsReachBottom = true;
                for (var i = capYPositionArray.length - 1; i >= 0; i--) {
                    that.allCapsReachBottom = that.allCapsReachBottom && capYPositionArray[i] === 0;
                }
                if (that.allCapsReachBottom) {
                    cancelAnimationFrame(that.animationId);
                    return;
                }
            }
            var step = Math.round(array.length / meterNum);
            ctx.clearRect(0, 0, cwidth, cheight);
            for (var i = 0; i < meterNum; i++) {
                var value = array[i * step];
                if (capYPositionArray.length < Math.round(meterNum)) {
                    capYPositionArray.push(value);
                }
                ctx.fillStyle = capStyle;
                if (value < capYPositionArray[i]) {
                    ctx.fillRect(i * 12, cheight - --capYPositionArray[i], meterWidth, capHeight);
                } else {
                    ctx.fillRect(i * 12, cheight - value, meterWidth, capHeight);
                    capYPositionArray[i] = value;
                }
                ctx.fillStyle = gradient;
                ctx.fillRect(i * 12, cheight - value + capHeight, meterWidth, cheight);
            }
            that.animationId = requestAnimationFrame(drawMeter);
        };
        this.animationId = requestAnimationFrame(drawMeter);
    }
    _audioEnd() {
        if (this.forceStop) {
            this.forceStop = false;
            this.status = 1;
            return;
        }
        this.status = 0;
    }
}
