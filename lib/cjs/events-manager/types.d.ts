import { HttpEvent } from './events/http-event';
export declare enum HttpEventIdentifier {
    RequestStart = "RequestStart",
    RequestSucceded = "RequestSucceded",
    RequestErrored = "RequestErrored"
}
export declare type HttpEventHandler<T> = (payload: T) => void;
export declare type HttpEventClassType<T> = new (...args: unknown[]) => HttpEvent<T>;
