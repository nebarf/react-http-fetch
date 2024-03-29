import { cleanup, renderHook } from '@testing-library/react';
import { FetchMock } from 'jest-fetch-mock';
import {
  defaultHttpReqConfig,
  HttpContext,
  HttpContextToken,
  HttpError,
  HttpMethod,
  HttpRequest,
  RequestErroredEvent,
  RequestStartedEvent,
  RequestSuccededEvent,
  useHttpClient,
  useHttpEvent,
} from '..';
import { HttpClientProviderConfigFixture } from './fixtures/http-client-config-provider.fixture';

const fetch = global.fetch as FetchMock;

describe('use-http-client', () => {
  const fetchResponse = {
    name: 'Phelony',
    role: 'Admin',
  };

  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');
  });

  afterEach((): void => {
    cleanup();
    fetch.resetMocks();
    jest.runAllTimers();
  });

  test('should perform a http request', async () => {
    fetch.mockResponseOnce(JSON.stringify(fetchResponse));

    const { result } = renderHook(() => useHttpClient(), {
      wrapper: HttpClientProviderConfigFixture.create(),
    });

    const { request } = result.current;
    const baseUrlOverride = 'https://phelony.com';
    const relativeUrl = 'todos/1';
    const httpMethod = HttpMethod.Get;

    const res = await request({
      baseUrlOverride,
      relativeUrl,
      requestOptions: {
        method: httpMethod,
      },
    });

    expect(res).toEqual(fetchResponse);
    expect(fetch.mock.calls.length).toEqual(1);

    const [[fetchUrl, fetchParams]] = fetch.mock.calls;
    const {
      method: fetchMethod,
      headers: fetchHeaders,
      credentials: fetchCredentials,
      body: fetchBody,
      signal: fetchSignal,
    } = fetchParams || {};
    expect(fetchUrl).toBe(`${baseUrlOverride}/${relativeUrl}`);
    expect(fetchMethod).toBe(httpMethod);
    expect(fetchHeaders).toEqual(defaultHttpReqConfig.reqOptions.headers);
    expect(fetchCredentials).toBeUndefined();
    expect(fetchBody).toBeNull();
    expect(fetchSignal).toBeUndefined();
  });

  test('should allow to override provider request params', async () => {
    fetch.mockResponseOnce(JSON.stringify(fetchResponse));

    const { result } = renderHook(() => useHttpClient(), {
      wrapper: HttpClientProviderConfigFixture.create(),
    });

    const { request } = result.current;
    const baseUrlOverride = 'https://phelony.com';
    const relativeUrl = 'todos/1';
    const httpMethod = HttpMethod.Get;
    const headers = {
      'Content-Type': 'multipart/form-data;',
    };

    const res = await request({
      baseUrlOverride,
      relativeUrl,
      requestOptions: {
        method: httpMethod,
        headers,
      },
    });

    expect(res).toEqual(fetchResponse);
    expect(fetch.mock.calls.length).toEqual(1);

    const [[fetchUrl, fetchParams]] = fetch.mock.calls;
    const {
      method: fetchMethod,
      headers: fetchHeaders,
      signal: fetchSignal,
      body: fetchBody,
      credentials: fetchCredentials,
    } = fetchParams || {};
    expect(fetchUrl).toBe(`${baseUrlOverride}/${relativeUrl}`);
    expect(fetchMethod).toBe(httpMethod);
    expect(fetchHeaders).toEqual(headers);
    expect(fetchSignal).toBeUndefined();
    expect(fetchBody).toBeNull();
    expect(fetchCredentials).toBeUndefined();
  });

  test('should return a http error if the response has errors', async () => {
    const fetchError = new Error('Fetch error');
    fetch.mockRejectOnce(fetchError);

    const { result } = renderHook(() => useHttpClient(), {
      wrapper: HttpClientProviderConfigFixture.create(),
    });

    const showGlobalLoader = new HttpContextToken(true);
    const reqContext = new HttpContext().set(showGlobalLoader, false);

    const { request } = result.current;

    try {
      await request({ context: reqContext });
    } catch (error) {
      expect(error).toBeInstanceOf(HttpError);
      expect(error.message).toBe(fetchError.message);
      expect(error.status).toBeUndefined();
      expect(error.statusText).toBeUndefined();
      expect(error.response).toBeUndefined();
      expect(error.request.url).toBe('/');
      expect(error.request.context).toBe(reqContext);
      expect(error.nativeError).toBe(fetchError);
    }

    expect(fetch.mock.calls.length).toEqual(1);
    const [[fetchUrl, fetchParams]] = fetch.mock.calls;
    expect(fetchUrl).toBe('/');
    expect(fetchParams?.headers).toEqual(defaultHttpReqConfig.reqOptions.headers);
    expect(fetchParams?.method).toBe(defaultHttpReqConfig.reqOptions.method);
    expect(fetchParams?.body).toBeNull();
    expect(fetchParams?.credentials).toBeUndefined();
    expect(fetchParams?.signal).toBeUndefined();
  });

  test('should dispatch events when the request starts and succeeds', async () => {
    fetch.mockResponseOnce(JSON.stringify(fetchResponse));

    const { result: useHttpClientResult } = renderHook(() => useHttpClient(), {
      wrapper: HttpClientProviderConfigFixture.create(),
    });

    const requestStartedEventHandler = jest.fn();
    renderHook(() => useHttpEvent(RequestStartedEvent, requestStartedEventHandler));

    const requestSuccededEventHandler = jest.fn();
    renderHook(() => useHttpEvent(RequestSuccededEvent, requestSuccededEventHandler));

    const requestErroredEventHandler = jest.fn();
    renderHook(() => useHttpEvent(RequestErroredEvent, requestSuccededEventHandler));

    await useHttpClientResult.current.request({});

    function checkHttpEventHandlerReqParam(httpRequest: HttpRequest<void>) {
      expect(httpRequest.baseUrl).toBe('');
      expect(httpRequest.body).toBeUndefined();
      expect(httpRequest.credentials).toBeUndefined();
      expect(httpRequest.headers).toEqual(defaultHttpReqConfig.reqOptions.headers);
      expect(httpRequest.maxAge).toBe(0);
      expect(httpRequest.method).toBe(defaultHttpReqConfig.reqOptions.method);
      expect(httpRequest.queryParams).toBeUndefined();
      expect(httpRequest.relativeUrl).toBe('');
      expect(httpRequest.signal).toBeUndefined();
      expect(httpRequest.url).toBe('/');
      expect(httpRequest.serializedQueryParams).toBe('');
      expect(httpRequest.urlWithParams).toBe('/');
    }

    const [[startedEventRequestParam]] = requestStartedEventHandler.mock.calls;
    expect(requestStartedEventHandler.mock.calls.length).toBe(1);
    checkHttpEventHandlerReqParam(startedEventRequestParam);

    const [[{ request: succededEventRequestParam, response: succededEventResponseParam }]] =
      requestSuccededEventHandler.mock.calls;
    expect(requestSuccededEventHandler.mock.calls.length).toBe(1);
    expect(succededEventResponseParam).toEqual(fetchResponse);
    checkHttpEventHandlerReqParam(succededEventRequestParam);

    expect(requestErroredEventHandler.mock.calls.length).toBe(0);

    const fetchCalls = fetch.mock.calls;
    expect(fetchCalls.length).toBe(1);
    const [[fetchUrl, fetchParams]] = fetchCalls;
    expect(fetchUrl).toBe('/');
    expect(fetchParams).toEqual({
      ...defaultHttpReqConfig.reqOptions,
      method: HttpMethod.Get,
      body: null,
      credentials: undefined,
      maxAge: 0,
      signal: undefined,
      queryParams: undefined,
    });
  });

  test('should dispatch events when the request starts and goes in error', async () => {
    const fetchError = new Error('Fetch error');
    fetch.mockRejectOnce(fetchError);

    const queryParams = { orderBy: 'age+' };

    const { result: useHttpClientResult } = renderHook(() => useHttpClient(), {
      wrapper: HttpClientProviderConfigFixture.create(),
    });

    const requestStartedEventHandler = jest.fn();
    renderHook(() => useHttpEvent(RequestStartedEvent, requestStartedEventHandler));

    const requestSuccededEventHandler = jest.fn();
    renderHook(() => useHttpEvent(RequestSuccededEvent, requestSuccededEventHandler));

    const requestErroredEventHandler = jest.fn();
    renderHook(() => useHttpEvent(RequestErroredEvent, requestErroredEventHandler));

    try {
      await useHttpClientResult.current.request({
        requestOptions: { queryParams },
      });
    } catch (error) {}

    function checkHttpEventHandlerReqParam(httpRequest: HttpRequest<void>) {
      expect(httpRequest.baseUrl).toBe('');
      expect(httpRequest.body).toBeUndefined();
      expect(httpRequest.credentials).toBeUndefined();
      expect(httpRequest.headers).toEqual(defaultHttpReqConfig.reqOptions.headers);
      expect(httpRequest.maxAge).toBe(0);
      expect(httpRequest.method).toBe(defaultHttpReqConfig.reqOptions.method);
      expect(httpRequest.queryParams).toEqual(queryParams);
      expect(httpRequest.relativeUrl).toBe('');
      expect(httpRequest.signal).toBeUndefined();
      expect(httpRequest.url).toBe('/');
      expect(httpRequest.serializedQueryParams).toBe('orderBy=age%2B');
      expect(httpRequest.urlWithParams).toBe('/?orderBy=age%2B');
    }

    const [[startedEventRequestParam]] = requestStartedEventHandler.mock.calls;
    expect(requestStartedEventHandler.mock.calls.length).toBe(1);
    checkHttpEventHandlerReqParam(startedEventRequestParam);

    expect(requestErroredEventHandler.mock.calls.length).toBe(1);
    const [[httpError]] = requestErroredEventHandler.mock.calls;
    expect(httpError).toBeInstanceOf(HttpError);
    checkHttpEventHandlerReqParam(httpError.request);
    expect(httpError.message).toEqual(fetchError.message);
    expect(httpError.status).toBeUndefined();
    expect(httpError.statusText).toBeUndefined();
    expect(httpError.response).toBeUndefined();

    expect(requestSuccededEventHandler.mock.calls.length).toBe(0);

    const fetchCalls = fetch.mock.calls;
    expect(fetchCalls.length).toBe(1);
    const [[fetchUrl, fetchParams]] = fetchCalls;
    expect(fetchUrl).toBe('/?orderBy=age%2B');
    expect(fetchParams).toEqual({
      ...defaultHttpReqConfig.reqOptions,
      method: HttpMethod.Get,
      body: null,
      credentials: undefined,
      maxAge: 0,
      signal: undefined,
      queryParams,
    });
  });

  test('should put the request response in the cache', async () => {
    fetch.mockResponseOnce(JSON.stringify(fetchResponse));

    const { result } = renderHook(() => useHttpClient(), {
      wrapper: HttpClientProviderConfigFixture.create(),
    });

    const { request } = result.current;

    const res1 = await request({
      requestOptions: { maxAge: 6000 },
    });

    expect(res1).toEqual(fetchResponse);
    const fetchCalls = fetch.mock.calls;
    expect(fetchCalls.length).toBe(1);
    const [[fetchUrl, fetchParams]] = fetchCalls;
    expect(fetchUrl).toBe('/');
    expect(fetchParams).toEqual({
      ...defaultHttpReqConfig.reqOptions,
      method: HttpMethod.Get,
      body: null,
      credentials: undefined,
      maxAge: 6000,
      signal: undefined,
      queryParams: undefined,
    });

    const res2 = await request({});
    expect(res2).toEqual(fetchResponse);
    expect(fetch.mock.calls.length).toBe(1);
  });

  test('should allow to abort a request', async () => {
    fetch.mockAbortOnce();

    const { result } = renderHook(() => useHttpClient(), {
      wrapper: HttpClientProviderConfigFixture.create(),
    });

    const { abortableRequest } = result.current;

    const [requestPromise, abortController] = abortableRequest({
      relativeUrl: 'posts',
    });

    try {
      abortController.abort();
      await requestPromise;
    } catch (error) {
      expect(error).toBeInstanceOf(HttpError);
      expect(error.status).toBeUndefined();
      expect(error.statsuText).toBeUndefined();
      expect(error.response).toBeUndefined();
      expect(error.message.trim()).toBe('The operation was aborted.');
      expect(error.request.url).toBe('/posts');
      expect(error.nativeError.name).toBe('AbortError');

      const fetchCalls = fetch.mock.calls;
      expect(fetchCalls.length).toBe(1);
      const [[fetchUrl, fetchParams]] = fetchCalls;
      expect(fetchUrl).toBe('/posts');
      expect(fetchParams).toEqual({
        ...defaultHttpReqConfig.reqOptions,
        method: HttpMethod.Get,
        body: null,
        credentials: undefined,
        maxAge: 0,
        signal: abortController.signal,
        queryParams: undefined,
      });
    }
  });

  test('should perform a post request', async () => {
    fetch.mockResponseOnce('');

    const { result } = renderHook(() => useHttpClient(), {
      wrapper: HttpClientProviderConfigFixture.create(),
    });

    const { post } = result.current;

    const postBody = { body: { name: 'Rico' } };

    const res1 = await post<string, unknown>({
      requestOptions: postBody,
      parser: (fetchRes: Response) => {
        return fetchRes.text();
      },
    });

    expect(res1).toBe('');
    const fetchCalls = fetch.mock.calls;
    expect(fetchCalls.length).toBe(1);
    const [[fetchUrl, fetchParams]] = fetchCalls;
    expect(fetchUrl).toBe('/');
    expect(fetchParams).toEqual({
      ...defaultHttpReqConfig.reqOptions,
      method: HttpMethod.Post,
      body: JSON.stringify(postBody.body),
      credentials: undefined,
      maxAge: 0,
      signal: undefined,
      queryParams: undefined,
    });
  });

  test('should perform a patch request', async () => {
    fetch.mockResponseOnce('');

    const { result } = renderHook(() => useHttpClient(), {
      wrapper: HttpClientProviderConfigFixture.create(),
    });

    const { patch } = result.current;

    const patchBody = { body: { name: 'Rico' } };

    const res1 = await patch<string, unknown>({
      requestOptions: patchBody,
      parser: (fetchRes: Response) => {
        return fetchRes.text();
      },
    });

    expect(res1).toBe('');
    const fetchCalls = fetch.mock.calls;
    expect(fetchCalls.length).toBe(1);
    const [[fetchUrl, fetchParams]] = fetchCalls;
    expect(fetchUrl).toBe('/');
    expect(fetchParams).toEqual({
      ...defaultHttpReqConfig.reqOptions,
      method: HttpMethod.Patch,
      body: JSON.stringify(patchBody.body),
      credentials: undefined,
      maxAge: 0,
      signal: undefined,
      queryParams: undefined,
    });
  });

  test('should perform a put request', async () => {
    fetch.mockResponseOnce('');

    const { result } = renderHook(() => useHttpClient(), {
      wrapper: HttpClientProviderConfigFixture.create(),
    });

    const { put } = result.current;

    const putBody = { body: { name: 'Rico' } };

    const res1 = await put<string, unknown>({
      requestOptions: putBody,
      parser: (fetchRes: Response) => {
        return fetchRes.text();
      },
    });

    expect(res1).toBe('');
    const fetchCalls = fetch.mock.calls;
    expect(fetchCalls.length).toBe(1);
    const [[fetchUrl, fetchParams]] = fetchCalls;
    expect(fetchUrl).toBe('/');
    expect(fetchParams).toEqual({
      ...defaultHttpReqConfig.reqOptions,
      method: HttpMethod.Put,
      body: JSON.stringify(putBody.body),
      credentials: undefined,
      maxAge: 0,
      signal: undefined,
      queryParams: undefined,
    });
  });

  test('should perform a delete request', async () => {
    fetch.mockResponseOnce('');

    const { result } = renderHook(() => useHttpClient(), {
      wrapper: HttpClientProviderConfigFixture.create(),
    });

    const { deleteReq } = result.current;

    const res1 = await deleteReq<string, unknown>({
      relativeUrl: 'posts/1',
      parser: (fetchRes: Response) => {
        return fetchRes.text();
      },
    });

    expect(res1).toBe('');
    const fetchCalls = fetch.mock.calls;
    expect(fetchCalls.length).toBe(1);
    const [[fetchUrl, fetchParams]] = fetchCalls;
    expect(fetchUrl).toBe('/posts/1');
    expect(fetchParams).toEqual({
      ...defaultHttpReqConfig.reqOptions,
      method: HttpMethod.Delete,
      body: null,
      credentials: undefined,
      maxAge: 0,
      signal: undefined,
      queryParams: undefined,
    });
  });

  test('should perform a get request', async () => {
    fetch.mockResponseOnce(JSON.stringify(fetchResponse));

    const { result } = renderHook(() => useHttpClient(), {
      wrapper: HttpClientProviderConfigFixture.create(),
    });

    const { get } = result.current;

    const res1 = await get({
      relativeUrl: 'posts/1',
    });

    expect(res1).toEqual(fetchResponse);
    const fetchCalls = fetch.mock.calls;
    expect(fetchCalls.length).toBe(1);
    const [[fetchUrl, fetchParams]] = fetchCalls;
    expect(fetchUrl).toBe('/posts/1');
    expect(fetchParams).toEqual({
      ...defaultHttpReqConfig.reqOptions,
      method: HttpMethod.Get,
      body: null,
      credentials: undefined,
      maxAge: 0,
      signal: undefined,
      queryParams: undefined,
    });
  });

  test('should perform an abortable get request', async () => {
    fetch.mockAbortOnce();

    const { result } = renderHook(() => useHttpClient(), {
      wrapper: HttpClientProviderConfigFixture.create(),
    });

    const { abortableGet } = result.current;
    const [requestPromise, abortController] = abortableGet({
      relativeUrl: 'posts',
    });

    try {
      abortController.abort();
      await requestPromise;
    } catch (error) {
      expect(error).toBeInstanceOf(HttpError);
      expect(error.status).toBeUndefined();
      expect(error.statusText).toBeUndefined();
      expect(error.response).toBeUndefined();
      expect(error.message.trim()).toBe('The operation was aborted.');
      expect(error.request.url).toBe('/posts');
      expect(error.nativeError.name).toBe('AbortError');

      const fetchCalls = fetch.mock.calls;
      expect(fetchCalls.length).toBe(1);
      const [[fetchUrl, fetchParams]] = fetchCalls;
      expect(fetchUrl).toBe('/posts');
      expect(fetchParams).toEqual({
        ...defaultHttpReqConfig.reqOptions,
        method: HttpMethod.Get,
        body: null,
        credentials: undefined,
        maxAge: 0,
        signal: abortController.signal,
        queryParams: undefined,
      });
    }
  });

  test('should perform an abortable post request', async () => {
    fetch.mockAbortOnce();

    const { result } = renderHook(() => useHttpClient(), {
      wrapper: HttpClientProviderConfigFixture.create(),
    });

    const fetchBody = { title: 'The post title' };

    const { abortablePost } = result.current;
    const [requestPromise, abortController] = abortablePost({
      requestOptions: { body: fetchBody },
      relativeUrl: 'posts/1',
    });

    try {
      abortController.abort();
      await requestPromise;
    } catch (error) {
      expect(error).toBeInstanceOf(HttpError);
      expect(error.status).toBeUndefined();
      expect(error.statusText).toBeUndefined();
      expect(error.response).toBeUndefined();
      expect(error.message.trim()).toBe('The operation was aborted.');
      expect(error.request.url).toBe('/posts/1');
      expect(error.nativeError.name).toBe('AbortError');

      const fetchCalls = fetch.mock.calls;
      expect(fetchCalls.length).toBe(1);
      const [[fetchUrl, fetchParams]] = fetchCalls;
      expect(fetchUrl).toBe('/posts/1');
      expect(fetchParams).toEqual({
        ...defaultHttpReqConfig.reqOptions,
        method: HttpMethod.Post,
        body: JSON.stringify(fetchBody),
        credentials: undefined,
        maxAge: 0,
        signal: abortController.signal,
        queryParams: undefined,
      });
    }
  });
});
