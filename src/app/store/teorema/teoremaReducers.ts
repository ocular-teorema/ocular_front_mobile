import { TeoremaActionUnion, TeoremaActionType } from './teoremaActions';

export const reducer = (state, action: TeoremaActionUnion) => {
  switch (action.type) {
    case TeoremaActionType.ADD_ORGANIZATIONS: {
      return {
        ...state,
        organizations: action.payload
      };
    }
    case TeoremaActionType.ADD_SELECTED_ORGANIZATION: {
      return {
        ...state,
        selectedOrganization: action.payload
      };
    }
    case TeoremaActionType.ADD_HEADER_STATE: {
      return {
        ...state,
        headerState: action.payload
      };
    }
    case TeoremaActionType.ADD_SIDEBAR_STATE: {
      return {
        ...state,
        sidebarState: action.payload
      };
    }
    default: {
      return state;
    }
  }
};
