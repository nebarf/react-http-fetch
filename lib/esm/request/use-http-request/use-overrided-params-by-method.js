var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { useMemo } from 'react';
export var useOverridedParamsByMethod = function (params, method) {
    /**
     * Override the http method of the provided request params.
     */
    var overridedParams = useMemo(function () {
        var newParams = __assign(__assign({}, params), { requestOptions: __assign(__assign({}, params.requestOptions), { method: method }) });
        return newParams;
    }, [params, method]);
    return overridedParams;
};
