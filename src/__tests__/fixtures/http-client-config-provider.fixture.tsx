import React, { ReactElement } from 'react';
import { HttpClientConfigProvider, HttpClientProviderConfig } from '../..';

export class HttpClientProviderConfigFixture {
  static create<HttpRequestBodyT = void, HttpResponseT = unknown>(
    options: Partial<HttpClientProviderConfig<HttpRequestBodyT, HttpResponseT>> = {}
  ): ({ children }: { children: ReactElement }) => ReactElement {
    const fallenbackOptions: Partial<HttpClientProviderConfig<HttpRequestBodyT, HttpResponseT>> =
      options;

    return ({ children }: { children: ReactElement }): ReactElement => {
      const Provider = (
        <HttpClientConfigProvider config={fallenbackOptions}>{children}</HttpClientConfigProvider>
      );

      return Provider;
    };
  }
}
