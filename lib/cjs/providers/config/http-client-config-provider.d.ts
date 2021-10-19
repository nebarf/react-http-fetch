import React, { ReactElement } from 'react';
import { HttpClientContextProps, HttpClientProviderProps } from './types';
/**
 * The context to provide the default http client configuration.
 */
export declare const HttpClientContext: React.Context<HttpClientContextProps>;
export declare const memoizedProvider: React.MemoExoticComponent<{
    ({ config, children }: HttpClientProviderProps): ReactElement;
    displayName: string;
}>;
/**
 * A utility hook to get the http client config context.
 */
export declare const useHttpClientConfig: () => HttpClientContextProps;
