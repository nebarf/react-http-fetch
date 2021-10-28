import { Reducer, useCallback, useEffect, useReducer, useRef } from 'react';
import { PerformHttpRequestParams, useHttpClient } from '../..';
import { HttpReqActionType, requestError, requestInit, requestSuccess } from './action-creators';
import { httpRequestReducer, HttpRequestState, initialState } from './state-reducer';
import { UseHttpRequestParams, UseHttpRequestReturn } from './types';
import fastCompare from 'react-fast-compare';
import { useCompareCallback } from '../../shared/use-compare-callback';

export const useHttpRequest = <HttpResponse>(
  params: UseHttpRequestParams<HttpResponse>
): UseHttpRequestReturn<HttpResponse> => {
  /**
   * Grabs the "request" function from the http client.
   */
  const { request: httpClientRequest } = useHttpClient();

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
   * Performs the http request.
   */
  const request = useCompareCallback(
    async () => {
      safelyDispatch(requestInit());

      try {
        const reqParams: PerformHttpRequestParams = {
          baseUrlOverride: params.baseUrlOverride,
          parser: params.parser,
          relativeUrl: params.relativeUrl,
          requestOptions: params.requestOptions,
        };
        const response = await httpClientRequest<HttpResponse>(reqParams);
        safelyDispatch(requestSuccess(response));

        return response;
      } catch (error) {
        // Dispatch the action handling the errored request.
        safelyDispatch(requestError(error));
        throw error;
      }
    },
    [httpClientRequest, params, safelyDispatch],
    (prev, actual) => fastCompare(prev, actual)
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

  return [state, request];
};
