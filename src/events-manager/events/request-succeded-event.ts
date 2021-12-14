import { HttpRequest } from '../../client';
import { HttpEvent } from './http-event';

export interface RequestSuccededEventPayload<T, U> {
  request: HttpRequest<U>;
  response: T;
}

export class RequestSuccededEvent<T, U> extends HttpEvent<RequestSuccededEventPayload<T, U>> {
  /**
   * @inheritdoc
   */
  payload: RequestSuccededEventPayload<T, U>;

  constructor(payload: RequestSuccededEventPayload<T, U>) {
    super();
    this.payload = payload;
  }
}
