import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { IState } from '../store';
import { Subscription } from 'rxjs';
import { AddSelectedOrganization, AddHeaderState } from '../store/teorema/teoremaActions';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public isMobileMenuActive: boolean;
  public organizationsData: Array<any>;
  public selectedOrganizationId: number;
  private _headerSub = new Subscription();

  constructor(
    private _store: Store<IState>,
    private _router: Router,
    private _authService: AuthService
  ) { }

  public ngOnInit(): void {
    this._getOrganzations();
  }

  private _getOrganzations(): void {
    const storeSub = this._store.select('teorema')
      .subscribe(state => {
        if (
          state &&
          state.teoremaReducer
        ) {
          this.organizationsData = state.teoremaReducer.organizations;
          if (this.organizationsData) {
            this.selectedOrganizationId = this.organizationsData[0].id;
            if (!state.teoremaReducer.selectedOrganization) {
              this._store.dispatch(new AddSelectedOrganization(this.selectedOrganizationId));
            }
          }
        }
      });

    this._headerSub.add(storeSub);
  }

  public onChange(): void {
    this._store.dispatch(new AddSelectedOrganization(this.selectedOrganizationId));
  }

  public logout(): void {
    const logoutSub = this._authService.logout()
      .subscribe(() => {
        this._router.navigate(['auth']);
        this._store.dispatch(new AddHeaderState(false));
      });

      this._headerSub.add(logoutSub);
  }

  public ngOnDestroy(): void {
    this._headerSub.unsubscribe();
  }
}
