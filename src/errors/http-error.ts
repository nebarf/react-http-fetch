import { HttpStatusCode } from './http-status-code';

export class HttpError extends Error {
  /**
   * The http status code.
   */
  status: HttpStatusCode;

  /**
   * The http statsu text.
   */
  statusText: string;

  /**
   * The stringified response body.
   */
  body: string;

  constructor(message: string, status: HttpStatusCode, statusText: string, body: string) {
    super(message);

    this.status = status;
    this.statusText = statusText;
    this.body = body;

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}
