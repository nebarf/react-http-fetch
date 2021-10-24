import { AbortableHttpRequestReturn, UseHttpClientReturn } from './types';
import { HttpRequestInfo, PerformHttpRequestParams } from '.';
import { useCallback } from 'react';
import {
  RequestErroredEvent,
  RequestStartedEvent,
  RequestSuccededEvent,
  useEventBus,
} from '../events-manager';
import { useHttpClientConfig } from '../config';
import { HttpError } from '..';

export const useHttpClient = (): UseHttpClientReturn => {
  /**
   * The http client config.
   */
  const {
    config: { reqOptions: defaultOptions, responseParser, requestBodySerializer, baseUrl },
  } = useHttpClientConfig();

  /**
   * The event bus.
   */
  const eventBus = useEventBus();

  /**
   * Perform a fetch request allowing to observe the response stream.
   */
  const performHttpRequest = useCallback(
    async <HttpResponse>({
      baseUrlOverride,
      parser,
      relativeUrl,
      requestOptions,
    }: PerformHttpRequestParams): Promise<HttpResponse> => {
      /**
       * Compose the request data.
       */
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

      /**
       * Encapsulate all request info.
       */
      const requestInfo: HttpRequestInfo = {
        url,
        ...mergedOptions,
      };

      try {
        /**
         * Publish the event to tell a new request started.
         */
        const requestStartedEvent = new RequestStartedEvent(requestInfo);
        eventBus.publish(requestStartedEvent);

        /**
         * Perform the request.
         */
        const response: Response = await fetch(url, mergedOptions);

        /**
         * Handle any errors different than the network ones
         * (e.g. 4xx and 5xx are not network errors).
         */
        if (!response.ok) {
          const { status, statusText } = response;
          const httpError = new HttpError(
            statusText || 'Http Error',
            status,
            requestInfo,
            statusText
          );
          const requestErroredEvent = new RequestErroredEvent(httpError);
          eventBus.publish(requestErroredEvent);

          return Promise.reject(httpError);
        }

        /**
         * Apply the response parser.
         */
        const computedParser = parser || responseParser;
        const parsedResponse = (
          computedParser ? computedParser<HttpResponse>(response) : response
        ) as Promise<HttpResponse>;

        /**
         * Publish an event to tell the request succeded.
         */
        const requestSuccededEvent = new RequestSuccededEvent({
          request: requestInfo,
          response: parsedResponse,
        });
        eventBus.publish(requestSuccededEvent);

        return parsedResponse;
      } catch (error) {
        const httpError = new HttpError(
          error?.message || 'Http Error',
          error?.status || undefined,
          requestInfo
        );
        /**
         * Publish an event to tell the request errored.
         */
        const requestErroredEvent = new RequestErroredEvent(httpError);
        eventBus.publish(requestErroredEvent);

        return Promise.reject(error);
      }
    },
    [baseUrl, defaultOptions, requestBodySerializer, eventBus, responseParser]
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
