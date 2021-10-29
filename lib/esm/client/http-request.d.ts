import { HttpMethod } from '@/enum';
export interface HttpRequestProps {
    baseUrl: string;
    body?: BodyInit | null;
    credentials?: RequestCredentials;
    headers?: HeadersInit;
    maxAge?: number;
    method: HttpMethod;
    queryParams?: Record<string, string>;
    relativeUrl: string;
    signal?: AbortSignal;
}
export declare class HttpRequest implements HttpRequestProps {
    /**
     * The base url of the remote call. The subpath is
     * relative to the base url.
     */
    private _baseUrl;
    /**
     * The relative url of the request to be concatenated
     * to the base url.
     */
    private _relativeUrl;
    /**
     * The request body.
     */
    private _body?;
    /**
     * The request credentials.
     */
    private _credentials?;
    /**
     * The request headers.
     */
    private _headers?;
    /**
     * The request max age (in seconds).
     */
    private _maxAge;
    /**
     * The request http method.
     */
    private _method;
    /**
     * The request query params.
     */
    private _queryParams?;
    /**
     * The request abort signal.
     */
    private _signal?;
    constructor(requestOpts: HttpRequestProps);
    get baseUrl(): string;
    get body(): BodyInit | null;
    get credentials(): RequestCredentials | undefined;
    get headers(): HeadersInit | undefined;
    get maxAge(): number | undefined;
    get method(): HttpMethod;
    get queryParams(): Record<string, string> | undefined;
    get relativeUrl(): string;
    get signal(): AbortSignal | undefined;
    get url(): string;
    get serializedQueryParams(): string;
    get urlWithParams(): string;
}
