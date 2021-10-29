"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpRequest = void 0;
var HttpRequest = /** @class */ (function () {
    function HttpRequest(requestOpts) {
        var baseUrl = requestOpts.baseUrl, body = requestOpts.body, credentials = requestOpts.credentials, headers = requestOpts.headers, maxAge = requestOpts.maxAge, method = requestOpts.method, queryParams = requestOpts.queryParams, relativeUrl = requestOpts.relativeUrl, signal = requestOpts.signal;
        this._baseUrl = baseUrl;
        this._body = body || undefined;
        this._credentials = credentials;
        this._headers = headers;
        this._maxAge = maxAge || 0;
        this._method = method;
        this._queryParams = queryParams;
        this._relativeUrl = relativeUrl;
        this._signal = signal;
    }
    Object.defineProperty(HttpRequest.prototype, "baseUrl", {
        get: function () {
            return this._baseUrl;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HttpRequest.prototype, "body", {
        get: function () {
            return this._body || null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HttpRequest.prototype, "credentials", {
        get: function () {
            return this._credentials;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HttpRequest.prototype, "headers", {
        get: function () {
            return this._headers;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HttpRequest.prototype, "maxAge", {
        get: function () {
            return this._maxAge;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HttpRequest.prototype, "method", {
        get: function () {
            return this._method;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HttpRequest.prototype, "queryParams", {
        get: function () {
            return this._queryParams;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HttpRequest.prototype, "relativeUrl", {
        get: function () {
            return this._relativeUrl;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HttpRequest.prototype, "signal", {
        get: function () {
            return this._signal;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HttpRequest.prototype, "url", {
        get: function () {
            return this.baseUrl + "/" + this.relativeUrl;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HttpRequest.prototype, "serializedQueryParams", {
        get: function () {
            if (!this.queryParams) {
                return '';
            }
            var urlSearchParams = new URLSearchParams(this.queryParams);
            return urlSearchParams.toString();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HttpRequest.prototype, "urlWithParams", {
        get: function () {
            if (!this.serializedQueryParams) {
                return this.url;
            }
            return this.url + "?" + this.serializedQueryParams;
        },
        enumerable: false,
        configurable: true
    });
    return HttpRequest;
}());
exports.HttpRequest = HttpRequest;
