import { jsonHttpResponseParser } from '..';
import { HttpClientConfig } from './types';

/**
 * Default request options.
 */
export const defaultOptions: HttpClientConfig = {
  baseUrl: '',
  globalParser: jsonHttpResponseParser,
  reqOptions: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
};
