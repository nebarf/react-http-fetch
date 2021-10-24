import { HttpEvent } from './events/http-event';

export enum HttpEventIdentifier {
  RequestStart = 'RequestStart',
  RequestSucceded = 'RequestSucceded',
  RequestErrored = 'RequestErrored',
}

export type HttpEventHandler<T> = (payload: T) => void;

export type HttpEventClassType<T> = new (...args: unknown[]) => HttpEvent<T>;
