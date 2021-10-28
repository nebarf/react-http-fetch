import { HttpReqActionType } from './action-creators';
export interface HttpRequestState<T> {
    pristine: boolean;
    errored: boolean;
    isLoading: boolean;
    error: unknown;
    data: T;
}
export declare const initialState: <T>(data: T) => HttpRequestState<T>;
export declare const httpRequestReducer: <T>(state: HttpRequestState<T>, action: HttpReqActionType) => HttpRequestState<T>;
