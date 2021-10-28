import { HttpReqActionType } from './action-creators';
import { HttpRequestActions } from './actions';

export interface HttpRequestState<T> {
  pristine: boolean;
  errored: boolean;
  isLoading: boolean;
  error: unknown;
  data: T;
}

export const initialState = <T>(data: T): HttpRequestState<T> => ({
  pristine: true,
  isLoading: false,
  errored: false,
  error: null,
  data,
});

export const httpRequestReducer = <T>(
  state: HttpRequestState<T>,
  action: HttpReqActionType
): HttpRequestState<T> => {
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
        data: action.payload as T,
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
