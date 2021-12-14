import { useMemo } from 'react';
import { HttpMethod } from '../enum';
import { UseHttpRequestParams } from './types';

export const useOverridedParamsByMethod = <HttpResponseT, HttpRequestBodyT>(
  params: UseHttpRequestParams<HttpResponseT, HttpRequestBodyT>,
  method: HttpMethod
): UseHttpRequestParams<HttpResponseT, HttpRequestBodyT> => {
  /**
   * Override the http method of the provided request params.
   */
  const overridedParams = useMemo(() => {
    const newParams: UseHttpRequestParams<HttpResponseT, HttpRequestBodyT> = {
      ...params,
      requestOptions: {
        ...params.requestOptions,
        method,
      },
    };

    return newParams;
  }, [params, method]);

  return overridedParams;
};
