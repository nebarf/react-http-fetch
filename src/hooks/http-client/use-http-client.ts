import { AbortableHttpRequestReturn, UseHttpClientReturn } from './types';
import { PerformHttpRequestParams } from '.';
import { useCallback } from 'react';
import { useHttpClientConfig } from '../..';

export const useHttpClient = (): UseHttpClientReturn => {
  const {
    config: { reqOptions: defaultOptions, responseParser, requestBodySerializer, baseUrl },
    interceptors,
  } = useHttpClientConfig();

  /**
   * Perform a fetch request allowing to observe the response stream.
   */
  const performObservableHttpRequest = useCallback(
    ({
      baseUrlOverride,
      relativeUrl,
      requestOptions,
    }: Pick<
      PerformHttpRequestParams,
      'baseUrlOverride' | 'relativeUrl' | 'requestOptions'
    >): Promise<Response> => {
      const computedBaseUrl = baseUrlOverride || baseUrl;
      const url = `${computedBaseUrl}/${relativeUrl}`;

      const { body, method, headers = {}, credentials, signal } = requestOptions || {};
      const mergedOptions = {
        method: method || defaultOptions.method,
        credentials: credentials || defaultOptions.credentials,
        signal,
        headers: {
          ...defaultOptions.headers,
          ...headers,
        },
        body: body ? requestBodySerializer(body) : null,
      };

      // Catch network errors and turn them into a rejected promise.
      const fetchPromise = fetch(url, mergedOptions).then((response: Response) => {
        // Handle any errors different than the network ones
        // (e.g. 4xx and 5xx are not network errors).
        if (!response.ok) {
          throw response;
        }
        return response;
      });

      // Run http interceptors.
      interceptors.forEach((interceptor) => interceptor(fetchPromise));

      return fetchPromise;
    },
    [baseUrl, defaultOptions, interceptors, requestBodySerializer]
  );

  /**
   * Performs a fetch request.
   */
  const performHttpRequest = useCallback(
    <HttpResponse>({
      baseUrlOverride,
      parser,
      relativeUrl,
      requestOptions,
    }: PerformHttpRequestParams): Promise<HttpResponse> => {
      const fetchPromise = performObservableHttpRequest({
        baseUrlOverride,
        relativeUrl,
        requestOptions,
      });

      return fetchPromise.then((response: Response) => {
        // JSON conversion if there were no network error.
        const computedParser = parser || responseParser;
        return (
          computedParser ? computedParser<HttpResponse>(response) : response
        ) as Promise<HttpResponse>;
      });
    },
    [responseParser, performObservableHttpRequest]
  );

  /**
   * Performs an abortable fetch request.
   */
  const performAbortableHttpRequest = useCallback(
    <HttpResponse>({
      baseUrlOverride,
      parser,
      relativeUrl,
      requestOptions,
    }: PerformHttpRequestParams): AbortableHttpRequestReturn<HttpResponse> => {
      const abortController = new AbortController();
      const { signal } = abortController;

      const requestPromise = performHttpRequest<HttpResponse>({
        baseUrlOverride,
        parser,
        relativeUrl,
        requestOptions: {
          ...requestOptions,
          signal,
        },
      });

      return [requestPromise, abortController];
    },
    [performHttpRequest]
  );

  return { performHttpRequest, performAbortableHttpRequest };
};
