import { HttpRequestInfo } from '../..';
import { HttpEvent } from './http-event';
export declare class RequestStartedEvent extends HttpEvent<HttpRequestInfo> {
    /**
     * @inheritdoc
     */
    payload: HttpRequestInfo;
    constructor(payload: HttpRequestInfo);
}
