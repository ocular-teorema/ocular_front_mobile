import { Action } from '@ngrx/store';

export enum TeoremaActionType {
  ADD_ORGANIZATIONS = 'ADD_ORGANIZATIONS',
  ADD_SELECTED_ORGANIZATION = 'ADD_SELECTED_ORGANIZATION',
  ADD_HEADER_STATE = 'ADD_HEADER_STATE',
  ADD_SIDEBAR_STATE = 'ADD_SIDEBAR_STATE'
}

export class AddOrganizations implements Action {
 public readonly type = TeoremaActionType.ADD_ORGANIZATIONS;
 constructor(public payload: any) {}
}

export class AddSelectedOrganization implements Action {
  public readonly type = TeoremaActionType.ADD_SELECTED_ORGANIZATION;
  constructor(public payload: any) {}
}

export class AddHeaderState implements Action {
  public readonly type = TeoremaActionType.ADD_HEADER_STATE;
  constructor(public payload: any) {}
}

export class AddSidebarState implements Action {
  public readonly type = TeoremaActionType.ADD_SIDEBAR_STATE;
  constructor(public payload: any) {}
}

export type TeoremaActionUnion = AddOrganizations | AddSelectedOrganization | AddHeaderState | AddSidebarState;
