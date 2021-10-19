import { ReactElement } from 'react';
import { HttpRequestOptions, HttpResponseParser } from '../..';

export type ReqBodySerializerReturn =
  | string
  | null
  | ArrayBuffer
  | Blob
  | FormData
  | URLSearchParams;
export type HttpRequestBodySerializer = (body: BodyInit) => ReqBodySerializerReturn;

export interface HttpReqConfig {
  reqOptions: Partial<HttpRequestOptions>;
  baseUrl: string;
  responseParser: HttpResponseParser;
  requestBodySerializer: HttpRequestBodySerializer;
}

export type HttpInterceptor = (request: Promise<Response>) => Promise<void>;

export interface HttpClientContextProps {
  config: HttpReqConfig;
  interceptors: HttpInterceptor[];
}

export interface HttpClientProviderProps {
  children: ReactElement;
  config: HttpReqConfig;
  interceptors: HttpInterceptor[];
}
