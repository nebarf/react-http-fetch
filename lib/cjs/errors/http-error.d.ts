import { HttpStatusCode } from '..';
export declare class HttpError extends Error {
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
    constructor(message: string, status: HttpStatusCode, statusText: string, body: string);
}
