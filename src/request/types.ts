import { HttpRequestOptions, HttpResponseParser } from '../client';
import { HttpRequestState } from './state-reducer';

export interface UseHttpRequestParams<T> {
  relativeUrl: string;
  parser: HttpResponseParser;
  baseUrlOverride: string;
  requestOptions: Partial<HttpRequestOptions>;
  initialData: T;
  fetchOnBootstrap: boolean;
}

export type UseHttpRequestReturn<HttpResponse> = [
  HttpRequestState<HttpResponse>,
  () => [Promise<HttpResponse>, AbortController]
];
