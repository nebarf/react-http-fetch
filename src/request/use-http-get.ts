import { useHttpRequest } from './use-http-request';
import { HttpMethod } from '../enum';
import { UseHttpRequestParams, UseHttpRequestReturn } from './types';
import { useOverridedParamsByMethod } from './use-overrided-params-by-method';

export const useHttpGet = <HttpResponseT, HttpRequestBodyT = unknown>(
  params: Partial<UseHttpRequestParams<HttpResponseT, HttpRequestBodyT>>
): UseHttpRequestReturn<HttpResponseT> => {
  const overridedParams = useOverridedParamsByMethod(params, HttpMethod.Get);
  return useHttpRequest<HttpResponseT, HttpRequestBodyT>(overridedParams);
};
