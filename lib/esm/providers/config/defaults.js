import { jsonHttpResponseParser } from './response-parser';
import { serializeRequestBody } from './request-body-serializer';
export var defaultHttpReqConfig = {
    baseUrl: '',
    responseParser: jsonHttpResponseParser,
    requestBodySerializer: serializeRequestBody,
    reqOptions: {
        headers: {
            'Content-Type': 'application/json',
        },
    },
};
export var defaultClientProps = {
    config: defaultHttpReqConfig,
    interceptors: [],
};
