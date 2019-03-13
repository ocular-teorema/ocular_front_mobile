import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import {TeoremaService} from '../services/teorema/teorema.service';
import {MseService} from '../services/mse/mse';


@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss']
})
export class CameraComponent implements OnInit, OnDestroy {
  private _cameraSub = new Subscription();
  public currentCamera;

  private wfs;

  constructor(private _route: ActivatedRoute, private _teoremaService: TeoremaService, private _MseService: MseService) {

  }

  private activateVieo(camera) {
    const player = document.getElementById('camera-stream');
    this.currentCamera = camera;
    if (!window['MediaSource']) {
      player.addEventListener('webkitbeginfullscreen', function(){
        this.load();
        this.play();
      }, false);
      player.addEventListener('webkitendfullscreen', function(){
        this.load();
        this.play();
      }, false);
      player['src'] = camera.m3u8_video_url;
    } else {
      player['controls'] = false;
      this._MseService.mseConnect(player, camera.ws_video_url);
    }
  }


  public ngOnInit(): void {
    const routeSub = this._route.queryParams
      .subscribe(params => {
        const camSub = this._teoremaService.getCamera(params.id).subscribe(camera => {
          this.activateVieo(camera);
        });
        this._cameraSub.add(camSub);
      });
    this._cameraSub.add(routeSub);
  }

  public ngOnDestroy(): void {
    this._MseService.destroyConnection();
    this._cameraSub.unsubscribe();
  }

}
