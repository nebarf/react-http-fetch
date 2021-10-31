import { useHttpRequest } from './use-http-request';
import { HttpMethod } from '@/enum';
import { UseHttpRequestParams, UseHttpRequestReturn } from './types';
import { useOverridedParamsByMethod } from './use-overrided-params-by-method';

export const useHttpPut = <HttpResponse>(
  params: UseHttpRequestParams<HttpResponse>
): UseHttpRequestReturn<HttpResponse> => {
  const overridedParams = useOverridedParamsByMethod(params, HttpMethod.Put);
  return useHttpRequest<HttpResponse>(overridedParams);
};
