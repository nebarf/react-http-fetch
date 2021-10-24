import { HttpRequestInfo } from '../..';
import { HttpEvent } from './http-event';

export class RequestStartedEvent extends HttpEvent<HttpRequestInfo> {
  /**
   * @inheritdoc
   */
  payload: HttpRequestInfo;

  constructor(payload: HttpRequestInfo) {
    super();
    this.payload = payload;
  }
}
