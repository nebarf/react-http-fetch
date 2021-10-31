import { HttpClientContextProps, HttpClientConfig } from './types';
import { httpResponseParser } from './response-parser';
import { serializeRequestBody } from './request-body-serializer';
import { HttpInMemoryCacheService } from '@/cache';

export const defaultHttpReqConfig: HttpClientConfig = {
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

export const defaultClientProps: HttpClientContextProps = {
  config: defaultHttpReqConfig,
};
