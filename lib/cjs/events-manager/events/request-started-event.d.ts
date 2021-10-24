import { HttpEvent } from './http-event';
export declare class RequestStartedEvent extends HttpEvent<BodyInit> {
    /**
     * @inheritdoc
     */
    payload: BodyInit;
    constructor(payload: BodyInit);
}
