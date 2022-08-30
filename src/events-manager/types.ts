import { HttpEvent } from './events/http-event';

export enum HttpEventIdentifier {
  RequestStart = 'RequestStart',
  RequestSucceded = 'RequestSucceded',
  RequestErrored = 'RequestErrored',
}

export type HttpEventHandler<PayloadT> = (payload: PayloadT) => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type HttpEventClassType<PayloadT> = new (...args: any[]) => HttpEvent<PayloadT>;
