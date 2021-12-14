import { HttpCacheService, HttpCacheStore } from '../cache';
import { ReactElement } from 'react';
import { HttpRequestOptions, HttpResponseParser } from '../client';

export type ReqBodySerializerReturn = BodyInit | null;
export type HttpRequestBodySerializer = (body: unknown) => ReqBodySerializerReturn;

export interface HttpClientConfig<HttpRequestBodyT> {
  reqOptions: Partial<HttpRequestOptions<HttpRequestBodyT>>;
  baseUrl: string;
  responseParser: HttpResponseParser;
  requestBodySerializer: HttpRequestBodySerializer;
  cache: HttpCacheService;
}

export interface HttpClientContextProps<HttpRequestBodyT> {
  config: HttpClientConfig<HttpRequestBodyT>;
}

export interface HttpClientProviderConfig<HttpRequestBodyT> {
  reqOptions: Partial<HttpRequestOptions<HttpRequestBodyT>>;
  baseUrl: string;
  responseParser: HttpResponseParser;
  requestBodySerializer: HttpRequestBodySerializer;
  cacheStore: HttpCacheStore;
  cacheStorePrefix: string;
  cacheStoreSeparator: string;
}

export interface HttpClientProviderProps<HttpRequestBodyT> {
  children: ReactElement;
  config: Partial<HttpClientProviderConfig<HttpRequestBodyT>>;
}
