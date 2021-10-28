import { PerformHttpRequestParams } from '..';
export declare const useHttpRequest: <HttpResponse>(params: PerformHttpRequestParams) => () => Promise<HttpResponse>;
