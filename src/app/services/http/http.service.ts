import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export const SERVER_REST_URL = environment.apiBaseHref;
export const DEFAULT_HEADERS = {
  'X-Requested-With': 'XMLHttpRequest',
  'Content-Type': 'application/json',
  'Cache-Control': 'no-cache',
  Pragma: 'no-cache'
};

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private _http: HttpClient) {}

  private _createAuthHeaders(): any {
    const cookiesList = document.cookie.split(';');
    const cookiesObject: any = {};

    cookiesList.forEach(cookieItem => {
      const cookieItemSplitted = cookieItem.split('=');
      cookiesObject[cookieItemSplitted[0]] = cookieItemSplitted[1];
    });

    if (cookiesObject.csrftoken) {
      DEFAULT_HEADERS['X-CSRFToken'] = cookiesObject.csrftoken;
    }
    const headers = new HttpHeaders(DEFAULT_HEADERS);
    return headers;
  }

  public getData(url: string, data?: {}, path?: string): Observable<any> {
    return this._http
      .get<any>((path || SERVER_REST_URL) + url, {
        headers: this._createAuthHeaders(),
        params: data
      });
  }

  public postData(url: string, data?: {}): Observable<any> {
    return this._http
      .post<any>(SERVER_REST_URL + url, data, {
        headers: this._createAuthHeaders()
      });
  }
}
