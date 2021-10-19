"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useHttpClient = void 0;
var http_error_1 = require("../../errors/http-error");
var react_1 = require("react");
var __1 = require("../..");
var useHttpClient = function () {
    var _a = (0, __1.useHttpClientConfig)().config, defaultOptions = _a.reqOptions, globalParser = _a.globalParser, baseUrl = _a.baseUrl;
    /**
     * Performs a fetch.
     * @param {*} url
     * @param {*} requestOptions
     */
    var performHttpRequest = (0, react_1.useCallback)(function (_a) {
        var baseUrlOverride = _a.baseUrlOverride, parser = _a.parser, relativeUrl = _a.relativeUrl, requestOptions = _a.requestOptions;
        var computedBaseUrl = baseUrlOverride || baseUrl;
        var url = computedBaseUrl + "/" + relativeUrl;
        var body = requestOptions.body, method = requestOptions.method, _b = requestOptions.headers, headers = _b === void 0 ? {} : _b, credentials = requestOptions.credentials, signal = requestOptions.signal;
        var mergedOptions = {
            method: method || defaultOptions.method,
            credentials: credentials || defaultOptions.credentials,
            signal: signal,
            headers: __assign(__assign({}, defaultOptions.headers), headers),
            body: body,
        };
        return fetch(url, mergedOptions).then(function (response) {
            // Handle any network errors.
            if (!response.ok) {
                return response.text().then(function (resBody) {
                    var status = response.status, statusText = response.statusText;
                    throw new http_error_1.HttpError("" + (statusText || 'Network Error - Unkown Error'), status, statusText, resBody);
                });
            }
            // JSON conversion if there were no network error.
            var computedParser = parser || globalParser;
            return computedParser(response);
        });
    }, [baseUrl, globalParser, defaultOptions]);
    /**
     * Performs an abortable fetch.
     * @param {*} url
     * @param {*} requestOptions
     */
    var performAbortableHttpRequest = (0, react_1.useCallback)(function (_a) {
        var baseUrlOverride = _a.baseUrlOverride, parser = _a.parser, relativeUrl = _a.relativeUrl, requestOptions = _a.requestOptions;
        var abortController = new AbortController();
        var signal = abortController.signal;
        var requestPromise = performHttpRequest({
            baseUrlOverride: baseUrlOverride,
            parser: parser,
            relativeUrl: relativeUrl,
            requestOptions: __assign(__assign({}, requestOptions), { signal: signal }),
        });
        return [requestPromise, abortController];
    }, [baseUrl, globalParser, defaultOptions]);
    return { performHttpRequest: performHttpRequest, performAbortableHttpRequest: performAbortableHttpRequest };
};
exports.useHttpClient = useHttpClient;
