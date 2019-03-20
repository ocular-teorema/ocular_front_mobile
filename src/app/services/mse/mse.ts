import {Injectable} from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class MseService {


  private _mediaSource;
  private _currentVideoElement;
  private _videoCorrectionInterval;
  private _startPlayTimes;
  private _sourcesData;
  private _wsClient;
  private _streamUrl;
  private _sourceBuffer;

  private iniMSE(streamUrl?: string, videoElement?: HTMLMediaElement) {

    this._currentVideoElement = videoElement || this._currentVideoElement;
    this._streamUrl = streamUrl || this._streamUrl;
    this._currentVideoElement.pause();
    this._mediaSource = new MediaSource();
    this._mediaSource.addEventListener(
      'sourceopen', () => {
        this.onMediaSourceOpen();
      }
    );
    this._currentVideoElement.src = URL.createObjectURL(this._mediaSource);
    this._startPlayTimes = undefined;
    if (this._videoCorrectionInterval) {
      clearInterval(this._videoCorrectionInterval);
    }
  }


  private addSource(sourceBuffer, source) {
    try {
      sourceBuffer.appendBuffer(source);
    } catch(e) {
      console.log(e);
    }
  }

  private onMediaSourceOpen() {
    this._sourceBuffer = this._mediaSource.addSourceBuffer('video/mp4; codecs="avc1.4d401f"');

    this._sourceBuffer.onupdateend = () => {
      if (this._sourceBuffer.updating) {
        return;
      }
      const source = this._sourcesData.shift();
      if (!source) {
        return;
      }
      this.addSource(this._sourceBuffer, source);
    };

    this._wsClient = new WebSocket(this._streamUrl);
    this._wsClient.binaryType = 'arraybuffer';

    this._wsClient.onmessage = (event) => {
      if (this._sourceBuffer.updating) {
        this._sourcesData.push(event.data);
      } else {
        this.addSource(this._sourceBuffer, event.data);
      }

      if (!this._startPlayTimes) {
        this._currentVideoElement.currentTime = 1000000000;
      }
    };
    this._wsClient.onclose = () => {
      this.iniMSE();
    };
  }

  constructor() {
    this._sourcesData = [];
  }

  private initVideoElement() {
    const videoCorrectionTime = 1000;
    this._currentVideoElement.onplay = () => {
      if (!this._startPlayTimes) {
        this._startPlayTimes = {
          video: this._currentVideoElement.currentTime,
          system: Date.now()
        };
        this._videoCorrectionInterval = setInterval(() => {
          const currTime = (this._currentVideoElement.currentTime - this._startPlayTimes.video) * 1000;
          const currTimeRange = Date.now() - this._startPlayTimes.system;
          this._currentVideoElement.playbackRate = Math.min(
            Math.max(1, (videoCorrectionTime + currTimeRange - currTime) / videoCorrectionTime),
            1.5
          );
        }, videoCorrectionTime);
      }
    };

    this._currentVideoElement.oncanplay = () => {
      console.log('on Play');
      if (!this._startPlayTimes) {
        console.log('Play');
        this._currentVideoElement.play();
      }
    };

  }


  public destroyConnection() {
    if (this._wsClient) {
      this._wsClient.close();
      this._wsClient.onclose = undefined;
    }
    if (this._sourceBuffer) {
      this._sourceBuffer.abort();
      clearInterval(this._videoCorrectionInterval);
    }
  }

  public mseConnect(videoElement, streamUrl) {
    this.iniMSE(streamUrl, videoElement);
    this.initVideoElement();
  }
}
