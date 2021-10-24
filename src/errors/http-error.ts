import { HttpRequestInfo, HttpStatusCode } from '..';

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
  request?: HttpRequestInfo;

  constructor(
    message: string,
    status?: HttpStatusCode,
    requestInfo?: HttpRequestInfo,
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
