import { HttpEventClassType, HttpEventHandler } from '.';
export declare const useBusSubscribe: <T>(eventName: HttpEventClassType<T>, handler: HttpEventHandler<T>) => void;
