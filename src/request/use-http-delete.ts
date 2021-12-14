import { useHttpRequest } from './use-http-request';
import { HttpMethod } from '../enum';
import { UseHttpRequestParams, UseHttpRequestReturn } from './types';
import { useOverridedParamsByMethod } from './use-overrided-params-by-method';

export const useHttpDelete = <HttpResponseT, HttpRequestBodyT>(
  params: UseHttpRequestParams<HttpResponseT, HttpRequestBodyT>
): UseHttpRequestReturn<HttpResponseT> => {
  const overridedParams = useOverridedParamsByMethod(params, HttpMethod.Delete);
  return useHttpRequest<HttpResponseT, HttpRequestBodyT>(overridedParams);
};
