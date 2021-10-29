import { useMemo } from 'react';
import { HttpMethod } from '@/enum';
import { UseHttpRequestParams } from './types';

export const useOverridedParamsByMethod = <HttpResponse>(
  params: UseHttpRequestParams<HttpResponse>,
  method: HttpMethod
): UseHttpRequestParams<HttpResponse> => {
  /**
   * Override the http method of the provided request params.
   */
  const overridedParams = useMemo(() => {
    const newParams: UseHttpRequestParams<HttpResponse> = {
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
