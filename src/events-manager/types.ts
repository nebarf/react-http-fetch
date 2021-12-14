import { HttpEvent } from './events/http-event';

export enum HttpEventIdentifier {
  RequestStart = 'RequestStart',
  RequestSucceded = 'RequestSucceded',
  RequestErrored = 'RequestErrored',
}

export type HttpEventHandler<PayloadT> = (payload: PayloadT) => void;

export type HttpEventClassType<PayloadT> = new (...args: unknown[]) => HttpEvent<PayloadT>;
