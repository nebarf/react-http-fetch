import { useHttpRequest } from '.';
import { HttpMethod } from '@/enum';
import { useOverridedParamsByMethod } from './use-overrided-params-by-method';
export var useHttpPost = function (params) {
    var overridedParams = useOverridedParamsByMethod(params, HttpMethod.Post);
    return useHttpRequest(overridedParams);
};
