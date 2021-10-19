import { HttpError } from '../../errors/http-error';
import { AbortableHttpRequestReturn, UseHttpClientReturn } from './types';
import { PerformHttpRequestParams } from '.';
import { useCallback } from 'react';
import { useHttpClientConfig } from '../../providers/http-client-provider';

export const useHttpClient = (): UseHttpClientReturn => {
  const { reqOptions: defaultOptions, globalParser, baseUrl } = useHttpClientConfig();

  /**
   * Performs a fetch.
   * @param {*} url
   * @param {*} requestOptions
   */
  const performHttpRequest = useCallback(
    <HttpResponse>({
      baseUrlOverride,
      parser,
      relativeUrl,
      requestOptions,
    }: PerformHttpRequestParams): Promise<HttpResponse> => {
      const computedBaseUrl = baseUrlOverride || baseUrl;
      const url = `${computedBaseUrl}/${relativeUrl}`;

      const { body, method, headers = {}, credentials, signal } = requestOptions;
      const mergedOptions = {
        method: method || defaultOptions.method,
        credentials: credentials || defaultOptions.credentials,
        signal,
        headers: {
          ...defaultOptions.headers,
          ...headers,
        },
        body,
      };

      return fetch(url, mergedOptions).then((response: Response) => {
        // Handle any network errors.
        if (!response.ok) {
          return response.text().then((resBody: string) => {
            const { status, statusText } = response;
            throw new HttpError(
              `${statusText || 'Network Error - Unkown Error'}`,
              status,
              statusText,
              resBody
            );
          });
        }
        // JSON conversion if there were no network error.
        const computedParser = parser || globalParser;
        return computedParser<HttpResponse>(response) as Promise<HttpResponse>;
      });
    },
    [baseUrl, globalParser, defaultOptions]
  );

  /**
   * Performs an abortable fetch.
   * @param {*} url
   * @param {*} requestOptions
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
    [baseUrl, globalParser, defaultOptions]
  );

  return { performHttpRequest, performAbortableHttpRequest };
};
