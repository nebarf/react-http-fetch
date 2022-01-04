import { HttpMethod, HttpRequest, HttpRequestProps } from '../..';

export class HttpRequestFixture {
  static defaultOptions: HttpRequestProps<undefined> = {
    baseUrl: 'http://rhf.com',
    method: HttpMethod.Get,
    relativeUrl: 'comments',
  };

  static create<HttpRequestBodyT = void>(
    options?: HttpRequestProps<HttpRequestBodyT>
  ): HttpRequest<HttpRequestBodyT> {
    const fallenbackOptions: HttpRequestProps<HttpRequestBodyT> = {
      ...HttpRequestFixture.defaultOptions,
      ...options,
    };

    return new HttpRequest(fallenbackOptions);
  }
}
