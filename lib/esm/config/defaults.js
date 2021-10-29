import { httpResponseParser } from './response-parser';
import { serializeRequestBody } from './request-body-serializer';
import { HttpInMemoryCacheService } from '@/cache';
export var defaultHttpReqConfig = {
    baseUrl: '',
    responseParser: httpResponseParser,
    requestBodySerializer: serializeRequestBody,
    reqOptions: {
        headers: {
            'Content-Type': 'application/json',
        },
    },
    cache: new HttpInMemoryCacheService(),
};
export var defaultClientProps = {
    config: defaultHttpReqConfig,
};
