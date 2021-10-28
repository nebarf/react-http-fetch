var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { HttpRequestActions } from './actions';
export var initialState = function (data) { return ({
    pristine: true,
    isLoading: false,
    errored: false,
    error: null,
    data: data,
}); };
export var httpRequestReducer = function (state, action) {
    switch (action.type) {
        case HttpRequestActions.RequestInit:
            return __assign(__assign({}, state), { errored: false, isLoading: true, pristine: false });
        case HttpRequestActions.RequestSuccess:
            return __assign(__assign({}, state), { isLoading: false, errored: false, data: action.payload });
        case HttpRequestActions.RequestError:
            return __assign(__assign({}, state), { isLoading: false, errored: true, error: action.payload });
        default:
            return state;
    }
};
