import { useHttpRequest } from '..';
import { HttpMethod } from '../..';
import { UseHttpRequestParams, UseHttpRequestReturn } from './types';
import { useOverridedParamsByMethod } from './use-overrided-params-by-method';

export const useHttpGet = <HttpResponse>(
  params: UseHttpRequestParams<HttpResponse>
): UseHttpRequestReturn<HttpResponse> => {
  const overridedParams = useOverridedParamsByMethod(params, HttpMethod.Get);
  return useHttpRequest<HttpResponse>(overridedParams);
};
