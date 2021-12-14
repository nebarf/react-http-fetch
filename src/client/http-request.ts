import { HttpMethod } from '../enum';

export interface HttpRequestProps<HttpRequestBodyT> {
  baseUrl: string;
  body?: HttpRequestBodyT;
  credentials?: RequestCredentials;
  headers?: HeadersInit;
  maxAge?: number;
  method: HttpMethod;
  queryParams?: Record<string, string>;
  relativeUrl: string;
  signal?: AbortSignal;
}

export class HttpRequest<HttpRequestBodyT> implements HttpRequestProps<HttpRequestBodyT> {
  /**
   * The base url of the remote call. The subpath is
   * relative to the base url.
   */
  private _baseUrl: string;

  /**
   * The relative url of the request to be concatenated
   * to the base url.
   */
  private _relativeUrl: string;

  /**
   * The request body.
   */
  private _body?: HttpRequestBodyT;

  /**
   * The request credentials.
   */
  private _credentials?: RequestCredentials;

  /**
   * The request headers.
   */
  private _headers?: HeadersInit;

  /**
   * The request max age (in seconds).
   */
  private _maxAge: number;

  /**
   * The request http method.
   */
  private _method: HttpMethod;

  /**
   * The request query params.
   */
  private _queryParams?: Record<string, string>;

  /**
   * The request abort signal.
   */
  private _signal?: AbortSignal;

  constructor(requestOpts: HttpRequestProps<HttpRequestBodyT>) {
    const {
      baseUrl,
      body,
      credentials,
      headers,
      maxAge,
      method,
      queryParams,
      relativeUrl,
      signal,
    } = requestOpts;

    this._baseUrl = baseUrl;
    this._body = body || undefined;
    this._credentials = credentials;
    this._headers = headers;
    this._maxAge = maxAge || 0;
    this._method = method;
    this._queryParams = queryParams;
    this._relativeUrl = relativeUrl;
    this._signal = signal;
  }

  get baseUrl(): string {
    return this._baseUrl;
  }

  get body(): HttpRequestBodyT | undefined {
    return this._body;
  }

  get credentials(): RequestCredentials | undefined {
    return this._credentials;
  }

  get headers(): HeadersInit | undefined {
    return this._headers;
  }

  get maxAge(): number | undefined {
    return Number.isInteger(this._maxAge) ? this._maxAge : undefined;
  }

  get method(): HttpMethod {
    return this._method;
  }

  get queryParams(): Record<string, string> | undefined {
    return this._queryParams;
  }

  get relativeUrl(): string {
    return this._relativeUrl;
  }

  get signal(): AbortSignal | undefined {
    return this._signal;
  }

  get url(): string {
    return `${this.baseUrl}/${this.relativeUrl}`;
  }

  get serializedQueryParams(): string {
    if (!this.queryParams) {
      return '';
    }
    const urlSearchParams = new URLSearchParams(this.queryParams);
    return urlSearchParams.toString();
  }

  get urlWithParams(): string {
    if (!this.serializedQueryParams) {
      return this.url;
    }
    return `${this.url}?${this.serializedQueryParams}`;
  }
}
