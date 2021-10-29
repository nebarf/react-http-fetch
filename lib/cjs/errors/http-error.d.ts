import { HttpRequest, HttpStatusCode } from '..';
export declare class HttpError<T> extends Error {
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
    constructor(message: string, status?: HttpStatusCode, requestInfo?: HttpRequest, statusText?: string, response?: T);
}
