"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestError = exports.requestSuccess = exports.requestInit = void 0;
var actions_1 = require("./actions");
var requestInit = function () { return ({
    type: actions_1.HttpRequestActions.RequestInit,
}); };
exports.requestInit = requestInit;
var requestSuccess = function (payload) { return ({
    type: actions_1.HttpRequestActions.RequestSuccess,
    payload: payload,
}); };
exports.requestSuccess = requestSuccess;
var requestError = function (payload) { return ({
    type: actions_1.HttpRequestActions.RequestError,
    payload: payload,
}); };
exports.requestError = requestError;
