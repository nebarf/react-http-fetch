import React, { ReactElement, createContext, useContext, memo } from 'react';
import { defaultOptions } from './defaults';
import { HttpClientConfig, HttpClientConfigProviderProps } from './types';

/**
 * The context to provide the default http client configuration.
 */
export const HttpClientConfigContext = createContext<HttpClientConfig>(defaultOptions);

/**
 * The provider for the default http client configuration.
 */
const HttpClientConfigProvider = ({
  config,
  children,
}: HttpClientConfigProviderProps): ReactElement => {
  return (
    <HttpClientConfigContext.Provider value={config}>{children}</HttpClientConfigContext.Provider>
  );
};

HttpClientConfigProvider.displayName = 'HttpClientConfigProvider';
export const memoizedProvider = memo(HttpClientConfigProvider);

/**
 * A utility hook to get the http client config context.
 */
export const useHttpClientConfig = (): HttpClientConfig => {
  const config = useContext(HttpClientConfigContext);
  return config;
};
