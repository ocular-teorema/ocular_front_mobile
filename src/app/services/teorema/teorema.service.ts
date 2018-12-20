import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { map } from 'rxjs/operators';

const ORGANIZATIONS_URL = '/organizations/';
const CAMERAS_GROUPS_URL = '/camera_groups/';
const CAMERAS_URL = '/cameras/';
const SERVERS_URL = '/servers/';

@Injectable({
  providedIn: 'root'
})
export class TeoremaService {

  constructor(private _http: HttpService) { }

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

  public getServers(): any {
    return this._http
      .getData(SERVERS_URL)
      .pipe(map((res: any) => res));
  }
}
