import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

const REST_AUTH_URL = '/rest-auth';
const LOGIN_URL = '/login/';
const LOGOUT_URL = '/logout/';
const PROFILE_URL = '/accounts/profile/';

const LOGIN_BASE_URL = REST_AUTH_URL + LOGIN_URL;
const LOGOUT_BASE_URL = REST_AUTH_URL + LOGOUT_URL;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _http: HttpService) { }

  public checkProfile(): Observable<any> {
    return this._http
      .getData('', false, PROFILE_URL)
      .pipe(map((res: any) => res));
  }

  public login(data: any): Observable<any> {
    return this._http
      .postData(LOGIN_BASE_URL, data)
      .pipe(map((res: any) => res));
  }

  public logout(): Observable<any> {
    return this._http
      .postData(LOGOUT_BASE_URL)
      .pipe(map((res: any) => res));
  }
}
