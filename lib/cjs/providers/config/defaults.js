"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultClientProps = exports.defaultHttpReqConfig = void 0;
var _1 = require(".");
exports.defaultHttpReqConfig = {
    baseUrl: '',
    globalParser: _1.jsonHttpResponseParser,
    reqOptions: {
        headers: {
            'Content-Type': 'application/json',
        },
    },
};
exports.defaultClientProps = {
    config: exports.defaultHttpReqConfig,
    deregisterInterceptor: function () {
        return;
    },
    registerInterceptor: function () {
        return;
    },
    interceptors: [],
};
