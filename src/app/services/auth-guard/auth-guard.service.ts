import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Store } from '@ngrx/store';
import { IState } from 'src/app/store';
import { AddHeaderState } from 'src/app/store/teorema/teoremaActions';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(
    private _router: Router,
    private _authService: AuthService,
    private _store: Store<IState>
  ) { }

  canActivate() {
    return this._authService
      .checkProfile()
      .toPromise()
      .then(
        () => {
          this._store.dispatch(new AddHeaderState(true));
          return true;
        },
        err => {
          if (err.status === 403) {
            this._router.navigate(['auth']);
          } else {
            alert(err.error.detail);
          }
        }
      );
  }
}
