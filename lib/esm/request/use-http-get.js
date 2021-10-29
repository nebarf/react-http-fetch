import { useHttpRequest } from '.';
import { HttpMethod } from '@/enum';
import { useOverridedParamsByMethod } from './use-overrided-params-by-method';
export var useHttpGet = function (params) {
    var overridedParams = useOverridedParamsByMethod(params, HttpMethod.Get);
    return useHttpRequest(overridedParams);
};