import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { IState } from './store';
import { TeoremaService } from './services/teorema/teorema.service';
import { AddOrganizations } from './store/teorema/teoremaActions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private _appSub = new Subscription();
  public isHeader: boolean;
  private _isOrganizationInited: boolean;

  constructor(
    private _teoremaService: TeoremaService,
    private _store: Store<IState>
  ) {}

  public ngOnInit(): void {
    const storeSub = this._store.select('teorema')
      .subscribe(state => {
        if (state && state.teoremaReducer) {
          this.isHeader = state.teoremaReducer.headerState;
          if (!this._isOrganizationInited) {
            this._getOrganzations();
          }
        }
      });

    this._appSub.add(storeSub);
  }

  private _getOrganzations(): void {
    const getOrgSub = this._teoremaService.getOrganzations()
      .subscribe(res => {
        this._isOrganizationInited = true;
        this._store.dispatch(new AddOrganizations(res));
      });

    this._appSub.add(getOrgSub);
  }

  public ngOnDestroy(): void {
    this._appSub.unsubscribe();
  }
}
