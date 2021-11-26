import { HttpMethod, HttpRequest, HttpRequestProps } from '../..';

export class HttpRequestFixture {
  static defaultOptions: HttpRequestProps = {
    baseUrl: 'http://rhf.com',
    method: HttpMethod.Get,
    relativeUrl: 'comments',
  };

  static create(options?: HttpRequestProps): HttpRequest {
    const fallenbackOptions: HttpRequestProps = options || HttpRequestFixture.defaultOptions;

    return new HttpRequest(fallenbackOptions);
  }
}
