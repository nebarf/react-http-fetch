"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultClientProps = exports.defaultHttpReqConfig = void 0;
var response_parser_1 = require("./response-parser");
var request_body_serializer_1 = require("./request-body-serializer");
exports.defaultHttpReqConfig = {
    baseUrl: '',
    responseParser: response_parser_1.httpResponseParser,
    requestBodySerializer: request_body_serializer_1.serializeRequestBody,
    reqOptions: {
        headers: {
            'Content-Type': 'application/json',
        },
    },
};
exports.defaultClientProps = {
    config: exports.defaultHttpReqConfig,
};
