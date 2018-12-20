import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {
  private _authSub = new Subscription();
  public login: string;
  public password: string;
  public isError: boolean;

  constructor(
    private _authService: AuthService,
    private _router: Router
  ) { }

  public ngOnInit(): void {
    this._login();
  }

  private _login(): void {
    const checkProfileSub = this._authService.checkProfile()
      .subscribe(() => this._router.navigate(['stream']));

    this._authSub.add(checkProfileSub);
  }

  public onSubmit(): void {
    const loginSub = this._authService.login({
      username: this.login,
      password: this.password
    })
    .subscribe(
      () => this._router.navigate(['stream']),
      () => this.isError = true
    );

    this._authSub.add(loginSub);
  }

  ngOnDestroy(): void {
    this._authSub.unsubscribe();
  }
}
