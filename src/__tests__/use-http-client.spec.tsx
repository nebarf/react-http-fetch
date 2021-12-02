import { cleanup } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { FetchMock } from 'jest-fetch-mock';
import {
  defaultHttpReqConfig,
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
    const { method: fetchMethod, headers: fetchHeaders } = fetchParams || {};
    expect(fetchUrl).toBe(`${baseUrlOverride}/${relativeUrl}`);
    expect(fetchMethod).toBe(httpMethod);
    expect(fetchHeaders).toEqual(defaultHttpReqConfig.reqOptions.headers);
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
    const { method: fetchMethod, headers: fetchHeaders } = fetchParams || {};
    expect(fetchUrl).toBe(`${baseUrlOverride}/${relativeUrl}`);
    expect(fetchMethod).toBe(httpMethod);
    expect(fetchHeaders).toEqual(headers);
  });

  test('should return a http error if the response has errors', async () => {
    const fetchError = new Error('Fetch error');
    fetch.mockRejectOnce(fetchError);

    const { result } = renderHook(() => useHttpClient(), {
      wrapper: HttpClientProviderConfigFixture.create(),
    });

    const { request } = result.current;

    try {
      await request({});
    } catch (error) {
      expect(error).toBeInstanceOf(HttpError);
      expect(error.message).toBe(fetchError.message);
      expect(error.status).toBeUndefined();
      expect(error.statusText).toBeUndefined();
      expect(error.response).toBeUndefined();
      expect(error.request.url).toBe('/');
      expect(error.nativeError).toBe(fetchError);
    }

    expect(fetch.mock.calls.length).toEqual(1);
    const [[fetchUrl, fetchParams]] = fetch.mock.calls;
    expect(fetchUrl).toBe('/');
    expect(fetchParams?.headers).toEqual(defaultHttpReqConfig.reqOptions.headers);
    expect(fetchParams?.method).toBe(defaultHttpReqConfig.reqOptions.method);
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

    function checkHttpEventHandlerReqParam(httpRequest: HttpRequest) {
      expect(httpRequest.baseUrl).toBe('');
      expect(httpRequest.body).toBeNull();
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

    function checkHttpEventHandlerReqParam(httpRequest: HttpRequest) {
      expect(httpRequest.baseUrl).toBe('');
      expect(httpRequest.body).toBeNull();
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
    expect(fetch.mock.calls.length).toBe(1);

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
      expect(fetch.mock.calls.length).toBe(1);
    }
  });

  test('should perform a post request', async () => {
    fetch.mockResponseOnce(JSON.stringify(fetchResponse));

    const { result } = renderHook(() => useHttpClient(), {
      wrapper: HttpClientProviderConfigFixture.create(),
    });

    const { post } = result.current;

    const res1 = await post({
      requestOptions: { body: JSON.stringify({ name: 'Rico' }) },
    });

    expect(res1).toEqual(fetchResponse);
    expect(fetch.mock.calls.length).toBe(1);
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
      expect(fetch.mock.calls.length).toBe(1);
    }
  });
});
