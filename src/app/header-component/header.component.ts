import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { IState } from '../store';
import { Subscription } from 'rxjs';
import { AddSelectedOrganization, AddHeaderState } from '../store/teorema/teoremaActions';
import { AuthService } from '../services/auth/auth.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private _headerSub = new Subscription();
  public isMobileMenuActive: boolean;
  public organizationsData: Array<any>;
  public selectedOrganizationId: number;
  public currentUrl: string;

  constructor(
    private _store: Store<IState>,
    private _router: Router,
    private _route: ActivatedRoute,
    private _authService: AuthService
  ) { }

  public ngOnInit(): void {
    if (this._router.url.indexOf('stream') !== -1 || this._router.url.indexOf('camera') !== -1) {
      this.currentUrl = 'stream';
    } else if (this._router.url.indexOf('archive') !== -1) {
      this.currentUrl = 'archive';
    }

    this._getOrganzations();
    this._updateHeader();
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

  private _updateHeader(): void {
    const eventSub = this._router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url.indexOf('stream') !== -1 || this._router.url.indexOf('camera') !== -1) {
          this.currentUrl = 'stream';
        } else if (event.url.indexOf('archive') !== -1) {
          this.currentUrl = 'archive';
        }
      }
    });

    this._headerSub.add(eventSub);
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
