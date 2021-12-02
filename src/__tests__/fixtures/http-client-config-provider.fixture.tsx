import React, { ReactElement } from 'react';
import { HttpClientConfigProvider, HttpClientProviderConfig } from '../..';

export class HttpClientProviderConfigFixture {
  static defaultOptions: Partial<HttpClientProviderConfig> = {};

  static create(
    options?: Partial<HttpClientProviderConfig>
  ): ({ children }: { children: ReactElement }) => ReactElement {
    const fallenbackOptions: Partial<HttpClientProviderConfig> =
      options || HttpClientProviderConfigFixture.defaultOptions;

    return ({ children }: { children: ReactElement }): ReactElement => {
      const Provider = (
        <HttpClientConfigProvider config={fallenbackOptions}>{children}</HttpClientConfigProvider>
      );

      return Provider;
    };
  }
}
