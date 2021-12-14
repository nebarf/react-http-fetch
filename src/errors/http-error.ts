import { HttpRequest } from '../client';
import { HttpStatusCode } from '../enum';

export class HttpError<HttpResponseT, HttpRequestBodyT> extends Error {
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
  response?: HttpResponseT;

  /**
   * The request info.
   */
  request?: HttpRequest<HttpRequestBodyT>;

  constructor(
    message: string,
    status?: HttpStatusCode,
    requestInfo?: HttpRequest<HttpRequestBodyT>,
    statusText?: string,
    response?: HttpResponseT
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
