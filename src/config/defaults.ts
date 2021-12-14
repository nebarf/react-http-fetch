import { HttpClientContextProps, HttpClientConfig } from './types';
import { httpResponseParser } from './response-parser';
import { serializeRequestBody } from './request-body-serializer';
import { HttpCacheService, HttpInMemoryCacheStore } from '../cache';
import { HttpCacheStorePrefixDecorator } from '../cache/prefix-decorator';

export const defaultCacheStore = new HttpInMemoryCacheStore();

export const defaultHttpReqConfig: HttpClientConfig<void> = {
  baseUrl: '',
  responseParser: httpResponseParser,
  requestBodySerializer: serializeRequestBody,
  reqOptions: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
  cache: new HttpCacheService(new HttpCacheStorePrefixDecorator(defaultCacheStore)),
};

export const defaultClientProps: HttpClientContextProps<void> = {
  config: defaultHttpReqConfig,
};
