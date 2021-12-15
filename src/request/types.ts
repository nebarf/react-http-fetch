import { HttpRequestOptions, HttpResponseParser } from '../client';
import { HttpContext } from '../client/http-context';
import { HttpRequestState } from './state-reducer';

export interface UseHttpRequestParams<InitialDataT, HttpRequestBodyT> {
  relativeUrl: string;
  parser: HttpResponseParser;
  baseUrlOverride: string;
  requestOptions: Partial<HttpRequestOptions<HttpRequestBodyT>>;
  initialData: InitialDataT;
  fetchOnBootstrap: boolean;
  context: HttpContext;
}

export interface UseHttpAbortableRequestReturn<HttpResponseT> {
  reqResult: Promise<HttpResponseT>;
  abortController: AbortController;
}

export type UseHttpRequestReturn<HttpResponseT> = [
  HttpRequestState<HttpResponseT>,
  () => UseHttpAbortableRequestReturn<HttpResponseT>
];
