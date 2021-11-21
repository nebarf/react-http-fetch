import { HttpMethod } from '../enum';

export interface UseHttpClientParams {
  baseUrl: string;
}

export type AbortableHttpRequestReturn<HttpResponse> = [
  res: Promise<HttpResponse>,
  abort: AbortController
];

export interface PerformHttpRequestParams {
  relativeUrl: string;
  parser: HttpResponseParser;
  baseUrlOverride: string;
  requestOptions: Partial<HttpRequestOptions>;
}

export type HttpClientRequest = <HttpResponse = Response>(
  params: Partial<PerformHttpRequestParams>
) => Promise<HttpResponse>;

export type HttpClientAbortableRequest = <HttpResponse = Response>(
  params: Partial<PerformHttpRequestParams>
) => AbortableHttpRequestReturn<HttpResponse>;

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

export interface HttpRequestOptions<RequestBody = BodyInit> {
  body: RequestBody | null | undefined;
  credentials: RequestCredentials | undefined;
  headers?: HeadersInit;
  maxAge?: number;
  method: HttpMethod;
  queryParams?: Record<string, string>;
  signal?: AbortSignal;
}

export type HttpResponseParser = <HttpResponse>(response: Response) => Promise<HttpResponse>;
