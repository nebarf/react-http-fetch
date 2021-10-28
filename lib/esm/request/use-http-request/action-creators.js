import { HttpRequestActions } from './actions';
export var requestInit = function () { return ({
    type: HttpRequestActions.RequestInit,
}); };
export var requestSuccess = function (payload) { return ({
    type: HttpRequestActions.RequestSuccess,
    payload: payload,
}); };
export var requestError = function (payload) { return ({
    type: HttpRequestActions.RequestError,
    payload: payload,
}); };
