import { HttpError } from '../../errors';
import { HttpEvent } from './http-event';

export class RequestErroredEvent<HttpResponseT, HttpRequestBodyT> extends HttpEvent<
  HttpError<HttpResponseT, HttpRequestBodyT>
> {
  /**
   * @inheritdoc
   */
  payload: HttpError<HttpResponseT, HttpRequestBodyT>;

  constructor(payload: HttpError<HttpResponseT, HttpRequestBodyT>) {
    super();
    this.payload = payload;
  }
}
