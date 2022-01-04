import { HttpReqActionType } from './action-creators';
import { HttpRequestActions } from './actions';

export interface HttpRequestState<DataT> {
  pristine: boolean;
  errored: boolean;
  isLoading: boolean;
  error: unknown;
  data?: DataT;
}

export const initialState = <DataT>(data?: DataT): HttpRequestState<DataT> => ({
  pristine: true,
  isLoading: false,
  errored: false,
  error: null,
  data,
});

export const httpRequestReducer = <DataT>(
  state: HttpRequestState<DataT>,
  action: HttpReqActionType
): HttpRequestState<DataT> => {
  switch (action.type) {
    case HttpRequestActions.RequestInit:
      return {
        ...state,
        errored: false,
        isLoading: true,
        pristine: false,
      };
    case HttpRequestActions.RequestSuccess:
      return {
        ...state,
        isLoading: false,
        errored: false,
        data: action.payload as DataT,
      };
    case HttpRequestActions.RequestError:
      return {
        ...state,
        isLoading: false,
        errored: true,
        error: action.payload,
      };
    default:
      return state;
  }
};
