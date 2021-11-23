import { HttpClientContextProps, HttpClientConfig } from './types';
import { httpResponseParser } from './response-parser';
import { serializeRequestBody } from './request-body-serializer';
import { HttpCacheService, HttpInMemoryCacheStore } from '../cache';

export const defaultHttpReqConfig: HttpClientConfig = {
  baseUrl: '',
  responseParser: httpResponseParser,
  requestBodySerializer: serializeRequestBody,
  reqOptions: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
  cache: new HttpCacheService(new HttpInMemoryCacheStore()),
};

export const defaultClientProps: HttpClientContextProps = {
  config: defaultHttpReqConfig,
};
