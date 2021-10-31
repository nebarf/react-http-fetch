import { Reducer, useCallback, useEffect, useReducer, useRef } from 'react';
import { HttpReqActionType, requestError, requestInit, requestSuccess } from './action-creators';
import { httpRequestReducer, HttpRequestState, initialState } from './state-reducer';
import { UseHttpRequestParams, UseHttpRequestReturn } from './types';
import fastCompare from 'react-fast-compare';
import { PerformHttpRequestParams, useHttpClient } from '@/client';
import { useCompareCallback } from '@/shared/use-compare-callback';
import { useCompareMemo } from '@/shared/use-compare-memo';

export const useHttpRequest = <HttpResponse>(
  params: UseHttpRequestParams<HttpResponse>
): UseHttpRequestReturn<HttpResponse> => {
  /**
   * Grabs the "request" function from the http client.
   */
  const { request: httpClientRequest, abortableRequest: httpClientAbortableRequest } =
    useHttpClient();

  // The state of the request.
  const [state, dispatch] = useReducer<Reducer<HttpRequestState<HttpResponse>, HttpReqActionType>>(
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
  const performHttpRequestParams: PerformHttpRequestParams = useCompareMemo(
    () => ({
      baseUrlOverride: params.baseUrlOverride,
      parser: params.parser,
      relativeUrl: params.relativeUrl,
      requestOptions: params.requestOptions,
    }),
    [params],
    fastCompare
  );

  /**
   * Performs the http request.
   */
  const request = useCompareCallback(
    async (): Promise<HttpResponse> => {
      safelyDispatch(requestInit());

      try {
        const response = await httpClientRequest<HttpResponse>(performHttpRequestParams);
        safelyDispatch(requestSuccess(response));

        return response;
      } catch (error) {
        // Dispatch the action handling the errored request.
        safelyDispatch(requestError(error));
        throw error;
      }
    },
    [httpClientRequest, performHttpRequestParams, safelyDispatch],
    fastCompare
  );

  /**
   * Performs the http request allowing to abort it.
   */
  const abortableRequest = useCompareCallback(
    (): [Promise<HttpResponse>, AbortController] => {
      safelyDispatch(requestInit());

      try {
        const [reqPromise, abortController] =
          httpClientAbortableRequest<HttpResponse>(performHttpRequestParams);
        reqPromise.then((response) => safelyDispatch(requestSuccess(response)));

        return [reqPromise, abortController];
      } catch (error) {
        // Dispatch the action handling the errored request.
        safelyDispatch(requestError(error));
        throw error;
      }
    },
    [httpClientAbortableRequest, performHttpRequestParams, safelyDispatch],
    fastCompare
  );

  /**
   * Keeps track of the mounting state of the component.
   */
  useEffect(() => {
    isMounted.current = true;

    const { fetchOnBootstrap } = params;
    if (fetchOnBootstrap) {
      request();
    }

    return () => {
      isMounted.current = false;
    };
  }, [params, request]);

  return [state, request, abortableRequest];
};
