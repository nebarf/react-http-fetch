import { useHttpRequest } from '.';
import { HttpMethod } from '../enum';
import { useOverridedParamsByMethod } from './use-overrided-params-by-method';
export var useHttpDelete = function (params) {
    var overridedParams = useOverridedParamsByMethod(params, HttpMethod.Delete);
    return useHttpRequest(overridedParams);
};
