import { HttpRequestActions } from './actions';
/**
 * The action to dispatch when a request starts.
 */
declare type RequestInitAction = {
    type: HttpRequestActions.RequestInit;
};
export declare const requestInit: () => RequestInitAction;
/**
 * The action to dispatch when a request completes successfully.
 */
declare type RequestSuccessAction<Payload> = {
    type: HttpRequestActions;
    payload: Payload;
};
export declare const requestSuccess: <Payload>(payload: Payload) => RequestSuccessAction<Payload>;
/**
 * The action to dispatch when the request goes in error.
 */
declare type RequestErrorAction = {
    type: HttpRequestActions;
    payload: unknown;
};
export declare const requestError: (payload: unknown) => RequestErrorAction;
export declare type HttpReqActionType = RequestInitAction | RequestErrorAction | RequestSuccessAction<unknown>;
export {};
