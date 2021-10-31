import { HttpRequest } from '@/client';
import { HttpEvent } from './http-event';
export interface RequestSuccededEventPayload<T> {
    request: HttpRequest;
    response: T;
}
export declare class RequestSuccededEvent<T> extends HttpEvent<RequestSuccededEventPayload<T>> {
    /**
     * @inheritdoc
     */
    payload: RequestSuccededEventPayload<T>;
    constructor(payload: RequestSuccededEventPayload<T>);
}
