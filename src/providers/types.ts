import { ReactElement } from 'react';
import { HttpRequestOptions, HttpResponseParser } from '..';

export interface HttpClientConfig {
  reqOptions: Partial<HttpRequestOptions>;
  baseUrl: string;
  globalParser: HttpResponseParser;
}

export interface HttpClientConfigProviderProps {
  config: HttpClientConfig;
  children: ReactElement;
}
