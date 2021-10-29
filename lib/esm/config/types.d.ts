import { HttpCache } from '@/cache';
import { ReactElement } from 'react';
import { HttpRequestOptions, HttpResponseParser } from '..';
export declare type ReqBodySerializerReturn = string | null | ArrayBuffer | Blob | FormData | URLSearchParams;
export declare type HttpRequestBodySerializer = (body: BodyInit) => ReqBodySerializerReturn;
export interface HttpClientConfig {
    reqOptions: Partial<HttpRequestOptions>;
    baseUrl: string;
    responseParser: HttpResponseParser;
    requestBodySerializer: HttpRequestBodySerializer;
    cache: HttpCache;
}
export declare type HttpInterceptor = (request: Promise<Response>) => Promise<void>;
export interface HttpClientContextProps {
    config: HttpClientConfig;
}
export interface HttpClientProviderProps {
    children: ReactElement;
    config: HttpClientConfig;
}
