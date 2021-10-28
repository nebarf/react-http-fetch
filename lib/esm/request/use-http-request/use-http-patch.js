import { useHttpRequest } from '..';
import { HttpMethod } from '../..';
import { useOverridedParamsByMethod } from './use-overrided-params-by-method';
export var useHttpPatch = function (params) {
    var overridedParams = useOverridedParamsByMethod(params, HttpMethod.Patch);
    return useHttpRequest(overridedParams);
};
