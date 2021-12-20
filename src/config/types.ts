import { HttpCacheService, HttpCacheStore } from '../cache';
import { ReactElement } from 'react';
import { HttpRequestOptions, HttpResponseParser } from '../client';

export type ReqBodySerializerReturn = BodyInit | null;
export type HttpRequestBodySerializer = (body: unknown) => ReqBodySerializerReturn;

export interface HttpClientConfig<HttpRequestBodyT, HttpResponseT> {
  reqOptions: Partial<HttpRequestOptions<HttpRequestBodyT>>;
  baseUrl: string;
  responseParser: HttpResponseParser<HttpResponseT>;
  requestBodySerializer: HttpRequestBodySerializer;
  cache: HttpCacheService;
}

export interface HttpClientContextProps<HttpRequestBodyT, HttpResponseT> {
  config: HttpClientConfig<HttpRequestBodyT, HttpResponseT>;
}

export interface HttpClientProviderConfig<HttpRequestBodyT, HttpResponseT> {
  reqOptions: Partial<HttpRequestOptions<HttpRequestBodyT>>;
  baseUrl: string;
  responseParser: HttpResponseParser<HttpResponseT>;
  requestBodySerializer: HttpRequestBodySerializer;
  cacheStore: HttpCacheStore;
  cacheStorePrefix: string;
  cacheStoreSeparator: string;
}

export interface HttpClientProviderProps<HttpRequestBodyT, HttpResponseT> {
  children: ReactElement;
  config: Partial<HttpClientProviderConfig<HttpRequestBodyT, HttpResponseT>>;
}
