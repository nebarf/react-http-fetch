import { AbortableHttpRequestReturn, UseHttpClientReturn, PerformHttpRequestParams } from './types';
import { HttpRequest } from './http-request';
import { useCallback } from 'react';
import {
  RequestErroredEvent,
  RequestStartedEvent,
  RequestSuccededEvent,
  useEventBus,
} from '../events-manager';
import { useHttpClientConfig } from '../config';
import { HttpMethod } from '../enum';
import { HttpError } from '../errors';

export const useHttpClient = (): UseHttpClientReturn => {
  /**
   * The http client config.
   */
  const {
    config: { reqOptions: defaultOptions, responseParser, requestBodySerializer, baseUrl, cache },
  } = useHttpClientConfig();

  /**
   * The event bus.
   */
  const eventBus = useEventBus();

  /**
   * Perform a fetch request allowing to observe the response stream.
   */
  const request = useCallback(
    async <HttpResponseT, HttpRequestBodyT = unknown>({
      baseUrlOverride,
      parser,
      relativeUrl,
      context,
      requestOptions,
    }: Partial<PerformHttpRequestParams<HttpRequestBodyT>>): Promise<HttpResponseT> => {
      /**
       * Compose the request data.
       */
      const computedBaseUrl = baseUrlOverride || baseUrl;

      const {
        body,
        method,
        headers = {},
        credentials,
        signal,
        maxAge,
        queryParams,
      } = requestOptions || {};
      const mergedOptions = {
        method: method || defaultOptions.method || HttpMethod.Get,
        credentials: credentials || defaultOptions.credentials,
        signal,
        headers: {
          ...defaultOptions.headers,
          ...headers,
        },
        body: body ? requestBodySerializer(body) : null,
        maxAge: maxAge || 0,
        queryParams,
      };

      /**
       * Encapsulate all request info.
       */
      const requestInfo: HttpRequest<HttpRequestBodyT> = new HttpRequest({
        ...mergedOptions,
        body: body || undefined,
        baseUrl: computedBaseUrl,
        relativeUrl: relativeUrl || '',
        context,
      });

      /**
       * Just return the cached response if it is in the cache.
       */
      const cachedResponse = cache.get<HttpResponseT, HttpRequestBodyT>(requestInfo);
      if (cachedResponse) {
        return cachedResponse;
      }

      try {
        /**
         * Publish the event to tell a new request started.
         */
        const requestStartedEvent = new RequestStartedEvent(requestInfo);
        eventBus.publish(requestStartedEvent);

        /**
         * Perform the request.
         */
        const response: Response = await fetch(requestInfo.url, mergedOptions);

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
        const parsedResponse = (await (computedParser
          ? computedParser<HttpResponseT>(response)
          : response)) as HttpResponseT;

        /**
         * Publish an event to tell the request succeded.
         */
        const requestSuccededEvent = new RequestSuccededEvent({
          request: requestInfo,
          response: parsedResponse,
        });
        eventBus.publish(requestSuccededEvent);

        // Save the request in the cache.
        cache.put(requestInfo, parsedResponse);

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
    [baseUrl, defaultOptions, requestBodySerializer, eventBus, responseParser, cache]
  );

  /**
   * Performs an abortable fetch request.
   */
  const abortableRequest = useCallback(
    <HttpResponseT, HttpRequestBodyT = unknown>({
      baseUrlOverride,
      parser,
      relativeUrl,
      requestOptions,
      context,
    }: Partial<
      PerformHttpRequestParams<HttpRequestBodyT>
    >): AbortableHttpRequestReturn<HttpResponseT> => {
      const abortController = new AbortController();
      const { signal } = abortController;

      const requestPromise = request<HttpResponseT, HttpRequestBodyT>({
        baseUrlOverride,
        parser,
        relativeUrl,
        context,
        requestOptions: {
          ...requestOptions,
          signal,
        },
      });

      return [requestPromise, abortController];
    },
    [request]
  );

  /**
   * Override the http method of the provided request params.
   */
  const overrideHttpMethod = useCallback(
    <HttpRequestBodyT>(
      params: Partial<PerformHttpRequestParams<HttpRequestBodyT>>,
      method: HttpMethod
    ): Partial<PerformHttpRequestParams<HttpRequestBodyT>> => {
      const { baseUrlOverride, parser, relativeUrl, requestOptions } = params;

      const overridedParams: Partial<PerformHttpRequestParams<HttpRequestBodyT>> = {
        baseUrlOverride,
        parser,
        relativeUrl,
        requestOptions: {
          ...requestOptions,
          method,
        },
      };

      return overridedParams;
    },
    []
  );

  /**
   * Perform a http request with the given http method.
   */
  const requestByMethod = useCallback(
    async <HttpResponseT, HttpRequestBodyT = unknown>(
      params: Partial<PerformHttpRequestParams<HttpRequestBodyT>>,
      method: HttpMethod
    ): Promise<HttpResponseT> => {
      const overridedParams: Partial<PerformHttpRequestParams<HttpRequestBodyT>> =
        overrideHttpMethod(params, method);
      return request<HttpResponseT, HttpRequestBodyT>(overridedParams);
    },
    [request, overrideHttpMethod]
  );

  /**
   * Performs a get http request.
   */
  const get = useCallback(
    async <HttpResponseT, HttpRequestBodyT>(
      params: Partial<PerformHttpRequestParams<HttpRequestBodyT>>
    ): Promise<HttpResponseT> => {
      return requestByMethod<HttpResponseT, HttpRequestBodyT>(params, HttpMethod.Get);
    },
    [requestByMethod]
  );

  /**
   * Performs a post http request.
   */
  const post = useCallback(
    async <HttpResponseT, HttpRequestBodyT>(
      params: Partial<PerformHttpRequestParams<HttpRequestBodyT>>
    ): Promise<HttpResponseT> => {
      return requestByMethod<HttpResponseT, HttpRequestBodyT>(params, HttpMethod.Post);
    },
    [requestByMethod]
  );

  /**
   * Performs a put http request.
   */
  const put = useCallback(
    async <HttpResponseT, HttpRequestBodyT>(
      params: Partial<PerformHttpRequestParams<HttpRequestBodyT>>
    ): Promise<HttpResponseT> => {
      return requestByMethod<HttpResponseT, HttpRequestBodyT>(params, HttpMethod.Get);
    },
    [requestByMethod]
  );

  /**
   * Performs a patch http request.
   */
  const patch = useCallback(
    async <HttpResponseT, HttpRequestBodyT>(
      params: Partial<PerformHttpRequestParams<HttpRequestBodyT>>
    ): Promise<HttpResponseT> => {
      return requestByMethod<HttpResponseT, HttpRequestBodyT>(params, HttpMethod.Get);
    },
    [requestByMethod]
  );

  /**
   * Performs a delete http request.
   */
  const deleteReq = useCallback(
    async <HttpResponseT, HttpRequestBodyT>(
      params: Partial<PerformHttpRequestParams<HttpRequestBodyT>>
    ): Promise<HttpResponseT> => {
      return requestByMethod<HttpResponseT, HttpRequestBodyT>(params, HttpMethod.Get);
    },
    [requestByMethod]
  );

  /**
   * Perform a http request with the given http method.
   */
  const abortableRequestByMethod = useCallback(
    <HttpResponseT, HttpRequestBodyT = unknown>(
      params: Partial<PerformHttpRequestParams<HttpRequestBodyT>>,
      method: HttpMethod
    ): AbortableHttpRequestReturn<HttpResponseT> => {
      const overridedParams: Partial<PerformHttpRequestParams<HttpRequestBodyT>> =
        overrideHttpMethod(params, method);
      return abortableRequest<HttpResponseT, HttpRequestBodyT>(overridedParams);
    },
    [abortableRequest, overrideHttpMethod]
  );

  /**
   * Performs an abortable http get vrequest.
   */
  const abortableGet = useCallback(
    <HttpResponseT, HttpRequestBodyT = unknown>(
      params: Partial<PerformHttpRequestParams<HttpRequestBodyT>>
    ): AbortableHttpRequestReturn<HttpResponseT> => {
      return abortableRequestByMethod<HttpResponseT, HttpRequestBodyT>(params, HttpMethod.Get);
    },
    [abortableRequestByMethod]
  );

  /**
   * Performs an abortable http post request.
   */
  const abortablePost = useCallback(
    <HttpResponseT, HttpRequestBodyT = unknown>(
      params: Partial<PerformHttpRequestParams<HttpRequestBodyT>>
    ): AbortableHttpRequestReturn<HttpResponseT> => {
      return abortableRequestByMethod<HttpResponseT, HttpRequestBodyT>(params, HttpMethod.Post);
    },
    [abortableRequestByMethod]
  );

  /**
   * Performs an abortable http patch request.
   */
  const abortablePatch = useCallback(
    <HttpResponseT, HttpRequestBodyT = unknown>(
      params: Partial<PerformHttpRequestParams<HttpRequestBodyT>>
    ): AbortableHttpRequestReturn<HttpResponseT> => {
      return abortableRequestByMethod<HttpResponseT, HttpRequestBodyT>(params, HttpMethod.Patch);
    },
    [abortableRequestByMethod]
  );

  /**
   * Performs an abortable http put request.
   */
  const abortablePut = useCallback(
    <HttpResponseT, HttpRequestBodyT = unknown>(
      params: Partial<PerformHttpRequestParams<HttpRequestBodyT>>
    ): AbortableHttpRequestReturn<HttpResponseT> => {
      return abortableRequestByMethod<HttpResponseT, HttpRequestBodyT>(params, HttpMethod.Put);
    },
    [abortableRequestByMethod]
  );

  /**
   * Performs an abortable http delete request.
   */
  const abortableDelete = useCallback(
    <HttpResponseT, HttpRequestBodyT = unknown>(
      params: Partial<PerformHttpRequestParams<HttpRequestBodyT>>
    ): AbortableHttpRequestReturn<HttpResponseT> => {
      return abortableRequestByMethod<HttpResponseT, HttpRequestBodyT>(params, HttpMethod.Delete);
    },
    [abortableRequestByMethod]
  );

  return {
    request,
    abortableRequest,
    get,
    post,
    put,
    patch,
    deleteReq,
    abortableGet,
    abortablePost,
    abortableDelete,
    abortablePut,
    abortablePatch,
  };
};
