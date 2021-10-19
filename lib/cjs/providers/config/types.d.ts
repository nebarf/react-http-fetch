import { ReactElement } from 'react';
import { HttpRequestOptions, HttpResponseParser } from '../..';
export interface HttpReqConfig {
    reqOptions: Partial<HttpRequestOptions>;
    baseUrl: string;
    globalParser: HttpResponseParser;
}
export declare type HttpInterceptor = () => void;
export interface HttpClientContextProps {
    config: HttpReqConfig;
    registerInterceptor: (handler: () => void) => void;
    deregisterInterceptor: (handler: () => void) => void;
    interceptors: HttpInterceptor[];
}
export interface HttpClientProviderProps {
    children: ReactElement;
    config: HttpReqConfig;
}
