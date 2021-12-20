import { HttpMethod } from '../enum';
import { HttpContext } from './http-context';

export interface UseHttpClientParams {
  baseUrl: string;
}

export type AbortableHttpRequestReturn<HttpResponseT> = [
  res: Promise<HttpResponseT>,
  abort: AbortController
];

export interface PerformHttpRequestParams<HttpRequestBodyT, HttpResponseT> {
  relativeUrl: string;
  parser: HttpResponseParser<HttpResponseT>;
  baseUrlOverride: string;
  context: HttpContext;
  requestOptions: Partial<HttpRequestOptions<HttpRequestBodyT>>;
}

export type HttpClientRequest = <HttpResponseT, HttpRequestBodyT>(
  params: Partial<PerformHttpRequestParams<HttpRequestBodyT, HttpResponseT>>
) => Promise<HttpResponseT>;

export type HttpClientAbortableRequest = <HttpResponseT, HttpRequestBodyT>(
  params: Partial<PerformHttpRequestParams<HttpRequestBodyT, HttpResponseT>>
) => AbortableHttpRequestReturn<HttpResponseT>;

export interface UseHttpClientReturn {
  request: HttpClientRequest;
  get: HttpClientRequest;
  post: HttpClientRequest;
  put: HttpClientRequest;
  patch: HttpClientRequest;
  deleteReq: HttpClientRequest;
  abortableRequest: HttpClientAbortableRequest;
  abortableGet: HttpClientAbortableRequest;
  abortablePost: HttpClientAbortableRequest;
  abortablePatch: HttpClientAbortableRequest;
  abortablePut: HttpClientAbortableRequest;
  abortableDelete: HttpClientAbortableRequest;
}

export interface HttpRequestOptions<RequestBody> {
  body: RequestBody | null | undefined;
  credentials: RequestCredentials | undefined;
  headers?: HeadersInit;
  maxAge?: number;
  method: HttpMethod;
  queryParams?: Record<string, string>;
  signal?: AbortSignal;
}

export type HttpResponseParser<HttpResponse> = (response: Response) => Promise<HttpResponse>;
