import { HttpRequest } from '../../client';
import { HttpEvent } from './http-event';

export interface RequestSuccededEventPayload<HttpResponseT, HttpRequestBodyT> {
  request: HttpRequest<HttpRequestBodyT>;
  response: HttpResponseT;
}

export class RequestSuccededEvent<HttpResponseT, HttpRequestBodyT> extends HttpEvent<
  RequestSuccededEventPayload<HttpResponseT, HttpRequestBodyT>
> {
  /**
   * @inheritdoc
   */
  payload: RequestSuccededEventPayload<HttpResponseT, HttpRequestBodyT>;

  constructor(payload: RequestSuccededEventPayload<HttpResponseT, HttpRequestBodyT>) {
    super();
    this.payload = payload;
  }
}
