import React, { ReactElement } from 'react';
import { HttpClientConfigProvider, HttpClientProviderConfig } from '../..';

export class HttpClientProviderConfigFixture {
  static defaultOptions: Partial<HttpClientProviderConfig<undefined>> = {};

  static create<HttpRequestBodyT = void>(
    options?: Partial<HttpClientProviderConfig<HttpRequestBodyT>>
  ): ({ children }: { children: ReactElement }) => ReactElement {
    const fallenbackOptions: Partial<HttpClientProviderConfig<HttpRequestBodyT>> =
      options || HttpClientProviderConfigFixture.defaultOptions;

    return ({ children }: { children: ReactElement }): ReactElement => {
      const Provider = (
        <HttpClientConfigProvider config={fallenbackOptions}>{children}</HttpClientConfigProvider>
      );

      return Provider;
    };
  }
}