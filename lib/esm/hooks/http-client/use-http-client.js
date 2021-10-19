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
import { useCallback } from 'react';
import { useHttpClientConfig } from '../..';
export var useHttpClient = function () {
    var _a = useHttpClientConfig(), _b = _a.config, defaultOptions = _b.reqOptions, responseParser = _b.responseParser, requestBodySerializer = _b.requestBodySerializer, baseUrl = _b.baseUrl, interceptors = _a.interceptors;
    /**
     * Perform a fetch request allowing to observe the response stream.
     */
    var performObservableHttpRequest = useCallback(function (_a) {
        var baseUrlOverride = _a.baseUrlOverride, relativeUrl = _a.relativeUrl, requestOptions = _a.requestOptions;
        var computedBaseUrl = baseUrlOverride || baseUrl;
        var url = computedBaseUrl + "/" + relativeUrl;
        var _b = requestOptions || {}, body = _b.body, method = _b.method, _c = _b.headers, headers = _c === void 0 ? {} : _c, credentials = _b.credentials, signal = _b.signal;
        var mergedOptions = {
            method: method || defaultOptions.method,
            credentials: credentials || defaultOptions.credentials,
            signal: signal,
            headers: __assign(__assign({}, defaultOptions.headers), headers),
            body: body ? requestBodySerializer(body) : null,
        };
        // Catch network errors and turn them into a rejected promise.
        var fetchPromise = fetch(url, mergedOptions).then(function (response) {
            // Handle any errors different than the network ones
            // (e.g. 4xx and 5xx are not network errors).
            if (!response.ok) {
                throw response;
            }
            return response;
        });
        // Run http interceptors.
        interceptors.forEach(function (interceptor) { return interceptor(fetchPromise); });
        return fetchPromise;
    }, [baseUrl, defaultOptions, interceptors, requestBodySerializer]);
    /**
     * Performs a fetch request.
     */
    var performHttpRequest = useCallback(function (_a) {
        var baseUrlOverride = _a.baseUrlOverride, parser = _a.parser, relativeUrl = _a.relativeUrl, requestOptions = _a.requestOptions;
        var fetchPromise = performObservableHttpRequest({
            baseUrlOverride: baseUrlOverride,
            relativeUrl: relativeUrl,
            requestOptions: requestOptions,
        });
        return fetchPromise.then(function (response) {
            // JSON conversion if there were no network error.
            var computedParser = parser || responseParser;
            return (computedParser ? computedParser(response) : response);
        });
    }, [responseParser, performObservableHttpRequest]);
    /**
     * Performs an abortable fetch request.
     */
    var performAbortableHttpRequest = useCallback(function (_a) {
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
    }, [performHttpRequest]);
    return { performHttpRequest: performHttpRequest, performAbortableHttpRequest: performAbortableHttpRequest };
};
