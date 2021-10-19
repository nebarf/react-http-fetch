import { HttpMethod } from '../../enum/http-method';

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

export interface UseHttpClientReturn<HttpResponse = Response> {
  performHttpRequest: (params: PerformHttpRequestParams) => Promise<HttpResponse>;
  performAbortableHttpRequest: (
    params: PerformHttpRequestParams
  ) => AbortableHttpRequestReturn<HttpResponse>;
}

export interface HttpRequestOptions<RequestBody = BodyInit> {
  body: RequestBody | null | undefined;
  method: HttpMethod;
  headers: HeadersInit;
  credentials: RequestCredentials | undefined;
  signal: AbortSignal;
}

export type HttpResponseParser = <HttpResponse>(response: Response) => Promise<HttpResponse>;
