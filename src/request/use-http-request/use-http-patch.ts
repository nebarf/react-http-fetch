import { useHttpRequest } from '..';
import { HttpMethod } from '../..';
import { UseHttpRequestParams, UseHttpRequestReturn } from './types';
import { useOverridedParamsByMethod } from './use-overrided-params-by-method';

export const useHttpPatch = <HttpResponse>(
  params: UseHttpRequestParams<HttpResponse>
): UseHttpRequestReturn<HttpResponse> => {
  const overridedParams = useOverridedParamsByMethod(params, HttpMethod.Patch);
  return useHttpRequest<HttpResponse>(overridedParams);
};
