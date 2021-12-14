import { HttpRequestActions } from './actions';

/**
 * The action to dispatch when a request starts.
 */
type RequestInitAction = { type: HttpRequestActions.RequestInit };
export const requestInit = (): RequestInitAction => ({
  type: HttpRequestActions.RequestInit,
});

/**
 * The action to dispatch when a request completes successfully.
 */
type RequestSuccessAction<PayloadT> = { type: HttpRequestActions; payload: PayloadT };
export const requestSuccess = <PayloadT>(payload: PayloadT): RequestSuccessAction<PayloadT> => ({
  type: HttpRequestActions.RequestSuccess,
  payload,
});

/**
 * The action to dispatch when the request goes in error.
 */
type RequestErrorAction = { type: HttpRequestActions; payload: unknown };
export const requestError = (payload: unknown): RequestErrorAction => ({
  type: HttpRequestActions.RequestError,
  payload,
});

export type HttpReqActionType =
  | RequestInitAction
  | RequestErrorAction
  | RequestSuccessAction<unknown>;
