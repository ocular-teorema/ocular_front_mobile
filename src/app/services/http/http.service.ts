import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export const SERVER_REST_URL = environment.apiBaseHref;

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private _http: HttpClient) {}

  public getData(url: string, data?: {}, path?: string): Observable<any> {
    return this._http
      .get<any>((path || SERVER_REST_URL) + url, {
        params: data
      });
  }

  public postData(url: string, data?: {}): Observable<any> {
    return this._http
      .post<any>(SERVER_REST_URL + url, data);
  }
}
