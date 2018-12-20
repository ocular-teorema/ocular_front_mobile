import { Component, OnInit, OnDestroy } from '@angular/core';
import { TeoremaService } from '../services/teorema/teorema.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { IState } from '../store';
import { AddSidebarState } from '../store/teorema/teoremaActions';

@Component({
  selector: 'app-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.scss']
})
export class StreamComponent implements OnInit, OnDestroy {
  private _streamSub = new Subscription();
  public organizationsData: Array<any>;
  public camerasGroupsData: Array<any>;
  public camerasData: Array<any>;
  private serversData: Array<any>;
  public selectedOrganizationId: number;

  constructor(
    private _store: Store<IState>,
    private _teoremaService: TeoremaService
  ) { }

  public ngOnInit(): void {
    this._getCameras();
  }

  private _getCameras(): void {
    const getCamerasSub = this._teoremaService.getCameras()
      .subscribe(res => {
        this.camerasData = res;
        this._getOrganzations();
        this._getServers();
      });
    this._streamSub.add(getCamerasSub);
  }

  private _getOrganzations(): void {
    const storeSub = this._store.select('teorema')
      .subscribe(state => {
        if (
          state &&
          state.teoremaReducer
        ) {
          this.organizationsData = state.teoremaReducer.organizations;
          if (state.teoremaReducer.selectedOrganization) {
            this.selectedOrganizationId = state.teoremaReducer.selectedOrganization;
            this.getCamerasGroups(state.teoremaReducer.sidebarState);
          }
        }
      });

    this._streamSub.add(storeSub);
  }

  public getCamerasGroups(groupId): void {
    const getCamerasGroupsSub = this._teoremaService.getCamerasGroups(this.selectedOrganizationId)
      .subscribe(res => {
        this.camerasGroupsData = res;
        this.camerasGroupsData.map(item => {
          item.isActive = false;
          item.cameras = this.camerasData.filter(camera => {
            if (camera.organization === groupId && camera.camera_group.id === item.id) {
              item.isActive = true;
            }
            return camera.camera_group.id === item.id;
          });
        });
      });
    this._streamSub.add(getCamerasGroupsSub);
  }

  private _getServers(): void {
    const getServersSub = this._teoremaService.getServers()
      .subscribe(res => {
        this.serversData = res;
        this.camerasData.map(item => {
          this.serversData.map(server => {
            if (server.id === item.server) {
              if (server.cameras) {
                server.cameras.push(item);
              } else {
                server.cameras = [];
                server.cameras.push(item);
              }
            }
          });
        });

        this._getPreviews();
      });

    this._streamSub.add(getServersSub);
  }

  private _getPreviews(): void {
    this.serversData.map(server => {
      server.cameras.map(camera => {
        this.camerasData.map(item => {
          if (item.port === camera.port) {
            item.preview = `http://${server.address}:8080/cam${item.id}/thumb.jpg`;
          }
        });
      });
    });
  }

  public closeAccordions(id): void {
    this.camerasGroupsData.map(item => {
      if (item.id !== id) {
        item.isActive = false;
      }
    });
  }

  public saveSidebarState(groupId): void {
    this._store.dispatch(new AddSidebarState(+groupId));
  }

  ngOnDestroy(): void {
    this._streamSub.unsubscribe();
  }
}
