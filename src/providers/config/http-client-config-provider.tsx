import React, { ReactElement, createContext, useContext, memo, useMemo } from 'react';
import { defaultClientProps, defaultHttpReqConfig, HttpReqConfig } from '.';
import { HttpClientContextProps, HttpClientProviderProps } from './types';

/**
 * The context to provide the default http client configuration.
 */
export const HttpClientContext = createContext<HttpClientContextProps>(defaultClientProps);

/**
 * The provider for the default http client configuration.
 */
const HttpClientConfigProvider = ({
  config,
  interceptors,
  children,
}: HttpClientProviderProps): ReactElement => {
  /**
   * The merged http config.
   */
  const mergedHttpConfig: HttpReqConfig = useMemo(
    () => ({
      baseUrl: config.baseUrl || defaultHttpReqConfig.baseUrl,
      responseParser: config.responseParser || defaultHttpReqConfig.responseParser,
      reqOptions: config.reqOptions || defaultHttpReqConfig.reqOptions,
      requestBodySerializer:
        config.requestBodySerializer || defaultHttpReqConfig.requestBodySerializer,
    }),
    [config]
  );

  const publicApi = useMemo(
    () => ({
      config: mergedHttpConfig,
      interceptors: interceptors,
    }),
    [mergedHttpConfig, interceptors]
  );

  return <HttpClientContext.Provider value={publicApi}>{children}</HttpClientContext.Provider>;
};

HttpClientConfigProvider.displayName = 'HttpClientProvider';
const memoizedProvider = memo(HttpClientConfigProvider);
export { memoizedProvider as HttpClientConfigProvider };

/**
 * A utility hook to get the http client config context.
 */
export const useHttpClientConfig = (): HttpClientContextProps => {
  const config = useContext(HttpClientContext);
  return config;
};
