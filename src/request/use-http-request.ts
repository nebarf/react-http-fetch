import { Reducer, useCallback, useReducer, useRef } from 'react';
import { HttpReqActionType, requestError, requestInit, requestSuccess } from './action-creators';
import { httpRequestReducer, HttpRequestState, initialState } from './state-reducer';
import { UseHttpAbortableRequestReturn, UseHttpRequestParams, UseHttpRequestReturn } from './types';
import fastCompare from 'react-fast-compare';
import { PerformHttpRequestParams, useHttpClient } from '../client';
import { useCompareCallback, useCompareMemo, useCompareEffect } from '../shared';

export const useHttpRequest = <HttpResponseT, HttpRequestBodyT = unknown>(
  params: Partial<UseHttpRequestParams<HttpResponseT, HttpRequestBodyT>>
): UseHttpRequestReturn<HttpResponseT> => {
  /**
   * Grabs the "request" function from the http client.
   */
  const { abortableRequest: httpClientAbortableRequest, request: httpClientRequest } =
    useHttpClient();

  // The state of the request.
  const [state, dispatch] = useReducer<Reducer<HttpRequestState<HttpResponseT>, HttpReqActionType>>(
    httpRequestReducer,
    initialState(params.initialData)
  );

  /**
   * A ref telling whether the component is currently mounted or not.
   */
  const isMounted = useRef<boolean>(false);

  /**
   * Safely dispatches an action by first checking the mounting state of the component.
   */
  const safelyDispatch = useCallback(
    (action: HttpReqActionType) => {
      if (isMounted.current) {
        dispatch(action);
      }
    },
    [dispatch]
  );

  /**
   * Gets the http params needed to perform the request using the http client related method.
   */
  const performHttpRequestParams: Partial<
    PerformHttpRequestParams<HttpRequestBodyT, HttpResponseT>
  > = useCompareMemo(
    () => ({
      baseUrlOverride: params.baseUrlOverride,
      parser: params.parser,
      relativeUrl: params.relativeUrl,
      requestOptions: params.requestOptions,
      context: params.context,
    }),
    [params],
    fastCompare
  );

  /**
   * Merges the overrided http params into the source one.
   */
  const mergeParams = useCallback(
    (
      source: Partial<PerformHttpRequestParams<HttpRequestBodyT, HttpResponseT>>,
      override: Partial<PerformHttpRequestParams<HttpRequestBodyT, HttpResponseT>>
    ): Partial<PerformHttpRequestParams<HttpRequestBodyT, HttpResponseT>> => {
      const { baseUrlOverride, parser, relativeUrl, requestOptions, context } = override;

      return {
        baseUrlOverride: baseUrlOverride || source.baseUrlOverride,
        parser: parser || source.parser,
        relativeUrl: relativeUrl || source.relativeUrl,
        context: context || source.context,
        requestOptions: {
          body: requestOptions?.body || source.requestOptions?.body,
          credentials: requestOptions?.credentials || source.requestOptions?.credentials,
          headers: {
            ...(source.requestOptions?.headers || {}),
            ...(requestOptions?.headers || {}),
          },
          maxAge: requestOptions?.maxAge || source.requestOptions?.maxAge,
          method: requestOptions?.method || source.requestOptions?.method,
          queryParams: requestOptions?.queryParams || source.requestOptions?.queryParams,
          signal: requestOptions?.signal || source.requestOptions?.signal,
        },
      };
    },
    []
  );

  /**
   * Performs the http request allowing to abort it.
   */
  const abortableRequest = useCompareCallback(
    (
      paramsOverride?: Partial<PerformHttpRequestParams<HttpRequestBodyT, HttpResponseT>>
    ): UseHttpAbortableRequestReturn<HttpResponseT> => {
      safelyDispatch(requestInit());

      const mergedParams = paramsOverride
        ? mergeParams(performHttpRequestParams, paramsOverride)
        : performHttpRequestParams;
      const [reqResult, abortController] = httpClientAbortableRequest<
        HttpResponseT,
        HttpRequestBodyT
      >(mergedParams);

      // Listen request to be successfully resolved or reject and
      // update the state accordingly.
      reqResult
        .then((response) => {
          safelyDispatch(requestSuccess(response));
        })
        .catch((error) => {
          safelyDispatch(requestError(error));
        });

      return { reqResult, abortController };
    },
    [httpClientAbortableRequest, performHttpRequestParams, safelyDispatch],
    fastCompare
  );

  /**
   * Performs the http request.
   */
  const request = useCompareCallback(
    (
      paramsOverride?: Partial<PerformHttpRequestParams<HttpRequestBodyT, HttpResponseT>>
    ): Promise<HttpResponseT> => {
      safelyDispatch(requestInit());

      const mergedParams = paramsOverride
        ? mergeParams(performHttpRequestParams, paramsOverride)
        : performHttpRequestParams;
      const reqResult = httpClientRequest<HttpResponseT, HttpRequestBodyT>(mergedParams);

      // Listen request to be successfully resolved or reject and
      // update the state accordingly.
      reqResult
        .then((response) => {
          safelyDispatch(requestSuccess(response));
        })
        .catch((error) => {
          safelyDispatch(requestError(error));
        });

      return reqResult;
    },
    [httpClientRequest, performHttpRequestParams, safelyDispatch],
    fastCompare
  );

  /**
   * Keeps track of the mounting state of the component.
   */
  useCompareEffect(
    () => {
      isMounted.current = true;

      const { fetchOnBootstrap } = params;
      if (fetchOnBootstrap) {
        request();
      }

      return () => {
        isMounted.current = false;
      };
    },
    [params, request],
    fastCompare
  );

  return [state, abortableRequest, request];
};
