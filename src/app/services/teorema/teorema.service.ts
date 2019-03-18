import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { map } from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

const ORGANIZATIONS_URL = '/organizations/';
const CAMERAS_GROUPS_URL = '/camera_groups/';
const CAMERAS_URL = '/cameras/';
const SERVERS_URL = '/servers/';

@Injectable({
  providedIn: 'root'
})
export class TeoremaService {

  constructor(private _http: HttpService, private _httpClient: HttpClient) { }

  public getOrganzations(): any {
    return this._http
      .getData(ORGANIZATIONS_URL)
      .pipe(map((res: any) => res));
  }

  public getCamerasGroups(organizationId): any {
    return this._http
      .getData(`${CAMERAS_GROUPS_URL}?organization=${organizationId}`)
      .pipe(map((res: any) => res));
  }

  public getCamera(camId): any {
    return this._http
      .getData(`${CAMERAS_URL}${camId}/`)
      .pipe(map((res: any) => res));
  }

  public getCameras(): any {
    return this._http
      .getData(CAMERAS_URL)
      .pipe(map((res: any) => res));
  }

  public getServers(serverId?: number): any {
    return this._http
      .getData(SERVERS_URL + (serverId ? serverId + '/' : ''))
      .pipe(map((res: any) => res));
  }


  public getStatistics(startDate, endDate, startTime, endTime, cameraId, serverAddress) {
    return this._httpClient.get(
        'http://' + serverAddress + ':5005/db/startDate=' + startDate +
        '&endDate=' + endDate + '&startTime=' + startTime + '&endTime=' + endTime + '&events=0&cam=cam' + cameraId
      );
  }
  public getEvents(startDate, endDate, startTime, endTime, cameraId, serverAddress) {
    return this._http
      .getData(
        'http://' + serverAddress + ':5005/archivedb/?startDate=' + startDate + '&endDate=' + endDate +
        '&startTime=' + startTime + '&endTime=' + endTime + '&cam=cam' + cameraId
      );
  }

}
