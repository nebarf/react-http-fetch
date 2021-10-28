import { useCallback } from 'react';
import { useHttpClient } from '..';
export var useHttpRequest = function (params) {
    var httpClientRequest = useHttpClient().request;
    var request = useCallback(function () {
        return httpClientRequest(params);
    }, [httpClientRequest, params]);
    return request;
};
