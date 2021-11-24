import React, { ReactElement, createContext, useContext, memo, useMemo } from 'react';
import { useCompareMemo } from '../shared';
import { defaultClientProps, defaultHttpReqConfig, defaultCacheStore } from './defaults';
import { HttpClientContextProps, HttpClientProviderProps, HttpClientConfig } from './types';
import fastCompare from 'react-fast-compare';
import { HttpCacheService } from '..';
import { HttpCacheStorePrefixDecorator } from '../cache/prefix-decorator';

/**
 * The context to provide the default http client configuration.
 */
export const HttpClientContext = createContext<HttpClientContextProps>(defaultClientProps);

/**
 * The provider for the default http client configuration.
 */
const HttpClientConfigProvider = ({ config, children }: HttpClientProviderProps): ReactElement => {
  /**
   * The merged http config.
   */
  const mergedHttpConfig: HttpClientConfig = useCompareMemo(
    () => {
      const cacheStore = config.cacheStore || defaultCacheStore;
      const prefixedCacheStore = new HttpCacheStorePrefixDecorator(
        cacheStore,
        config.cacheStorePrefix,
        config.cacheStoreSeparator
      );

      const cache = new HttpCacheService(prefixedCacheStore);

      return {
        baseUrl: config.baseUrl || defaultHttpReqConfig.baseUrl,
        responseParser: config.responseParser || defaultHttpReqConfig.responseParser,
        reqOptions: config.reqOptions || defaultHttpReqConfig.reqOptions,
        requestBodySerializer:
          config.requestBodySerializer || defaultHttpReqConfig.requestBodySerializer,
        cache,
      };
    },
    [config],
    fastCompare
  );

  const publicApi = useMemo(
    () => ({
      config: mergedHttpConfig,
    }),
    [mergedHttpConfig]
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
