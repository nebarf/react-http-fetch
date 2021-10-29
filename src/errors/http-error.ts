import { HttpRequest } from '@/client';
import { HttpStatusCode } from '@/enum';

export class HttpError<T> extends Error {
  /**
   * The http status code.
   */
  status?: HttpStatusCode;

  /**
   * The http statsu text.
   */
  statusText?: string;

  /**
   * The stringified response body.
   */
  response?: T;

  /**
   * The request info.
   */
  request?: HttpRequest;

  constructor(
    message: string,
    status?: HttpStatusCode,
    requestInfo?: HttpRequest,
    statusText?: string,
    response?: T
  ) {
    super(message);

    this.status = status;
    this.request = requestInfo;
    this.statusText = statusText;
    this.response = response;

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}
