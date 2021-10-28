import { HttpRequestOptions, HttpResponseParser } from '../..';
import { HttpRequestState } from './state-reducer';
export interface UseHttpRequestParams<T> {
    relativeUrl: string;
    parser: HttpResponseParser;
    baseUrlOverride: string;
    requestOptions: Partial<HttpRequestOptions>;
    initialData: T;
    fetchOnBootstrap: boolean;
}
export declare type UseHttpRequestReturn<HttpResponse> = [
    HttpRequestState<HttpResponse>,
    () => Promise<HttpResponse>
];
