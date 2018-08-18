import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class Visualizer {
    audioContext;
    source = null;
    animationId;
    buffer = { duration: 0 };
    allCapsReachBottom = false;
    constructor(private http: HttpClient) {
        // 创建AudioContext对象
        if (this.audioContext === null) {
            alert("浏览器不支持audioContext");
            return;
        }
        this.audioContext = new AudioContext();
    }
    // 开始请求数据
    start(url) {
        this.close();
        this.http.get(url, { responseType: "arraybuffer" }).subscribe(res => {
            this.audioContext = new AudioContext();
            this.audioContext.decodeAudioData(res, buffer => {
                this.visualize(this.audioContext, buffer);
                this.buffer = buffer;
            });
        });
    }
    // 播放
    play(sTime) {
        this.audioContext.resume();
        this.stop();
        this.visualize(this.audioContext, this.buffer, sTime);
    }
    // 停止
    stop() {
        if (this.source !== null) {
            this.source.stop();
            this.audioContext.suspend();
        }
    }
    // 关闭
    close() {
        this.audioContext.close();
    }
    getCurrentTime() {
        return this.audioContext.currentTime;
    }
    getDuration() {
        return this.buffer.duration;
    }
    visualize(audioContext, buffer, sTime = this.getCurrentTime()) {
        var audioBufferSouceNode = audioContext.createBufferSource(),
            analyser = audioContext.createAnalyser();

        audioBufferSouceNode.connect(analyser);
        audioBufferSouceNode.buffer = buffer;

        analyser.connect(audioContext.destination);

        if (!audioBufferSouceNode.start) {
            audioBufferSouceNode.start = audioBufferSouceNode.noteOn;
            audioBufferSouceNode.stop = audioBufferSouceNode.noteOff;
        }

        if (this.animationId !== null) {
            cancelAnimationFrame(this.animationId);
        }
        this.source = audioBufferSouceNode;
        console.log(this.getCurrentTime())
        this.source.start(0, sTime);
        this.drawSpectrum(analyser);
    }
    drawSpectrum(analyser) {
        var that = this,
            canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("canvas"),
            cwidth = canvas.width,
            cheight = canvas.height - 2,
            meterWidth = 10,
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
}
