import { HttpError } from '../..';
import { HttpEvent } from './http-event';
export declare class RequestErroredEvent<T> extends HttpEvent<HttpError<T>> {
    /**
     * @inheritdoc
     */
    payload: HttpError<T>;
    constructor(payload: HttpError<T>);
}
