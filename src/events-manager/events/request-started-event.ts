import { HttpRequest } from '../../client';
import { HttpEvent } from './http-event';

export class RequestStartedEvent<HttpRequestBodyT = unknown> extends HttpEvent<
  HttpRequest<HttpRequestBodyT>
> {
  /**
   * @inheritdoc
   */
  payload: HttpRequest<HttpRequestBodyT>;

  constructor(payload: HttpRequest<HttpRequestBodyT>) {
    super();
    this.payload = payload;
  }
}
