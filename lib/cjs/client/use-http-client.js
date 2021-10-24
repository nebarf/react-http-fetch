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
var react_1 = require("react");
var events_manager_1 = require("../events-manager");
var config_1 = require("../config");
var useHttpClient = function () {
    var _a = (0, config_1.useHttpClientConfig)().config, defaultOptions = _a.reqOptions, responseParser = _a.responseParser, requestBodySerializer = _a.requestBodySerializer, baseUrl = _a.baseUrl;
    var eventBus = (0, react_1.useContext)(events_manager_1.EventBusContext);
    /**
     * Perform a fetch request allowing to observe the response stream.
     */
    var performHttpRequest = (0, react_1.useCallback)(function (_a) {
        var baseUrlOverride = _a.baseUrlOverride, parser = _a.parser, relativeUrl = _a.relativeUrl, requestOptions = _a.requestOptions;
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
        var requestStartedEvent = new events_manager_1.RequestStartedEvent(__assign({ url: url }, mergedOptions));
        eventBus.publish(requestStartedEvent);
        // Catch network errors and turn them into a rejected promise.
        return fetch(url, mergedOptions)
            .then(function (response) {
            // Handle any errors different than the network ones
            // (e.g. 4xx and 5xx are not network errors).
            if (!response.ok) {
                throw response;
            }
            var computedParser = parser || responseParser;
            var parsedResponse = (computedParser ? computedParser(response) : response);
            var requestSuccededEvent = new events_manager_1.RequestSuccededEvent();
            eventBus.publish(requestSuccededEvent);
            return parsedResponse;
        })
            .catch(function (err) {
            var requestErroredEvent = new events_manager_1.RequestErroredEvent();
            eventBus.publish(requestErroredEvent);
            throw err;
        });
    }, [baseUrl, defaultOptions, requestBodySerializer, eventBus, responseParser]);
    /**
     * Performs an abortable fetch request.
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
    }, [performHttpRequest]);
    return { performHttpRequest: performHttpRequest, performAbortableHttpRequest: performAbortableHttpRequest };
};
exports.useHttpClient = useHttpClient;
