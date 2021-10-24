import { HttpClientContextProps, HttpReqConfig } from '.';
import { httpResponseParser } from './response-parser';
import { serializeRequestBody } from './request-body-serializer';

export const defaultHttpReqConfig: HttpReqConfig = {
  baseUrl: '',
  responseParser: httpResponseParser,
  requestBodySerializer: serializeRequestBody,
  reqOptions: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
};

export const defaultClientProps: HttpClientContextProps = {
  config: defaultHttpReqConfig,
};
