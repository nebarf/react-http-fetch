import React, { createContext, useContext, memo, useMemo } from 'react';
import { defaultClientProps, defaultHttpReqConfig } from '.';
/**
 * The context to provide the default http client configuration.
 */
export var HttpClientContext = createContext(defaultClientProps);
/**
 * The provider for the default http client configuration.
 */
var HttpClientConfigProvider = function (_a) {
    var config = _a.config, interceptors = _a.interceptors, children = _a.children;
    /**
     * The merged http config.
     */
    var mergedHttpConfig = useMemo(function () { return ({
        baseUrl: config.baseUrl || defaultHttpReqConfig.baseUrl,
        responseParser: config.responseParser || defaultHttpReqConfig.responseParser,
        reqOptions: config.reqOptions || defaultHttpReqConfig.reqOptions,
        requestBodySerializer: config.requestBodySerializer || defaultHttpReqConfig.requestBodySerializer,
    }); }, [config]);
    var publicApi = useMemo(function () { return ({
        config: mergedHttpConfig,
        interceptors: interceptors,
    }); }, [mergedHttpConfig, interceptors]);
    return React.createElement(HttpClientContext.Provider, { value: publicApi }, children);
};
HttpClientConfigProvider.displayName = 'HttpClientProvider';
var memoizedProvider = memo(HttpClientConfigProvider);
export { memoizedProvider as HttpClientConfigProvider };
/**
 * A utility hook to get the http client config context.
 */
export var useHttpClientConfig = function () {
    var config = useContext(HttpClientContext);
    return config;
};
