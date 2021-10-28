import { useHttpRequest } from '..';
import { HttpMethod } from '../..';
import { useOverridedParamsByMethod } from './use-overrided-params-by-method';
export var useHttpPut = function (params) {
    var overridedParams = useOverridedParamsByMethod(params, HttpMethod.Put);
    return useHttpRequest(overridedParams);
};
