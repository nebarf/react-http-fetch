import { HttpMethod } from '..';

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
  params: PerformHttpRequestParams
) => Promise<HttpResponse>;

export type HttpClientAbortableRequest = <HttpResponse = Response>(
  params: PerformHttpRequestParams
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
  method: HttpMethod;
  headers: HeadersInit;
  credentials: RequestCredentials | undefined;
  signal: AbortSignal;
}

export interface HttpRequestInfo extends RequestInit {
  url: string;
}

export type HttpResponseParser = <HttpResponse>(response: Response) => Promise<HttpResponse>;
