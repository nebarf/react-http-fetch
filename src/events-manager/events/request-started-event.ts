import { HttpRequest } from '../..';
import { HttpEvent } from './http-event';

export class RequestStartedEvent extends HttpEvent<HttpRequest> {
  /**
   * @inheritdoc
   */
  payload: HttpRequest;

  constructor(payload: HttpRequest) {
    super();
    this.payload = payload;
  }
}
