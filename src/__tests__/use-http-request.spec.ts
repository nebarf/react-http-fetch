import { cleanup } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react-hooks';
import { FetchMock } from 'jest-fetch-mock';
import {
  defaultHttpReqConfig,
  HttpContext,
  HttpContextToken,
  HttpError,
  HttpMethod,
  useHttpRequest,
} from '..';
import { HttpClientProviderConfigFixture } from './fixtures/http-client-config-provider.fixture';

const fetch = global.fetch as FetchMock;

describe('use-http-request', () => {
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

  test('should update request state when it is in progress and completes', async () => {
    fetch.mockResponseOnce(JSON.stringify(fetchResponse));

    const { result } = renderHook(() => useHttpRequest<{ name: string; role: string }>({}), {
      wrapper: HttpClientProviderConfigFixture.create(),
    });

    const [, performRequest] = result.current;

    expect(result.current[0].data).toBeUndefined();
    expect(result.current[0].error).toBeNull();
    expect(result.current[0].errored).toBe(false);
    expect(result.current[0].isLoading).toBe(false);
    expect(result.current[0].pristine).toBe(true);

    let reqResult: Promise<{ name: string; role: string }>;
    act(() => {
      const { reqResult: performRequestRes } = performRequest();
      reqResult = performRequestRes;
    });

    expect(result.current[0].data).toBeUndefined();
    expect(result.current[0].error).toBeNull();
    expect(result.current[0].errored).toBe(false);
    expect(result.current[0].isLoading).toBe(true);
    expect(result.current[0].pristine).toBe(false);

    await act(async () => {
      const res = await reqResult;
      expect(res).toEqual(fetchResponse);
    });

    expect(result.current[0].data).toEqual(fetchResponse);
    expect(result.current[0].error).toBeNull();
    expect(result.current[0].errored).toBe(false);
    expect(result.current[0].isLoading).toBe(false);
    expect(result.current[0].pristine).toBe(false);

    expect(fetch.mock.calls.length).toEqual(1);

    const [[fetchUrl, fetchParams]] = fetch.mock.calls;
    const {
      method: fetchMethod,
      headers: fetchHeaders,
      credentials: fetchCredentials,
      body: fetchBody,
      signal: fetchSignal,
    } = fetchParams || {};
    expect(fetchUrl).toBe('/');
    expect(fetchMethod).toBe(HttpMethod.Get);
    expect(fetchHeaders).toEqual(defaultHttpReqConfig.reqOptions.headers);
    expect(fetchCredentials).toBeUndefined();
    expect(fetchBody).toBeNull();
    expect(fetchSignal).toBeInstanceOf(AbortSignal);
  });

  test('should update the request state when it goes in error', async () => {
    const fetchError = new Error('Fetch error');
    fetch.mockRejectOnce(fetchError);

    const { result } = renderHook(() => useHttpRequest({}), {
      wrapper: HttpClientProviderConfigFixture.create(),
    });

    const [, performRequest] = result.current;

    expect(result.current[0].data).toBeUndefined();
    expect(result.current[0].error).toBeNull();
    expect(result.current[0].errored).toBe(false);
    expect(result.current[0].isLoading).toBe(false);
    expect(result.current[0].pristine).toBe(true);

    let reqResult: Promise<unknown>;
    act(() => {
      const { reqResult: performRequestRes } = performRequest();
      reqResult = performRequestRes;
    });

    expect(result.current[0].data).toBeUndefined();
    expect(result.current[0].error).toBeNull();
    expect(result.current[0].errored).toBe(false);
    expect(result.current[0].isLoading).toBe(true);
    expect(result.current[0].pristine).toBe(false);

    await act(async () => {
      try {
        await reqResult;
      } catch (error) {
        expect(error).toBeInstanceOf(HttpError);
        expect(error.message).toBe(fetchError.message);
        expect(error.status).toBeUndefined();
        expect(error.statusText).toBeUndefined();
        expect(error.response).toBeUndefined();
        expect(error.request.url).toBe('/');
        expect(error.nativeError).toBe(fetchError);
      }
    });

    expect(result.current[0].data).toBeUndefined();
    expect(result.current[0].error).toEqual(fetchError);
    expect(result.current[0].errored).toBe(true);
    expect(result.current[0].isLoading).toBe(false);
    expect(result.current[0].pristine).toBe(false);

    expect(fetch.mock.calls.length).toEqual(1);

    const [[fetchUrl, fetchParams]] = fetch.mock.calls;
    const {
      method: fetchMethod,
      headers: fetchHeaders,
      credentials: fetchCredentials,
      body: fetchBody,
      signal: fetchSignal,
    } = fetchParams || {};
    expect(fetchUrl).toBe('/');
    expect(fetchMethod).toBe(HttpMethod.Get);
    expect(fetchHeaders).toEqual(defaultHttpReqConfig.reqOptions.headers);
    expect(fetchCredentials).toBeUndefined();
    expect(fetchBody).toBeNull();
    expect(fetchSignal).toBeInstanceOf(AbortSignal);
  });

  test('should automatically perform the request on mount', async () => {
    fetch.mockResponseOnce(JSON.stringify(fetchResponse));

    const { result, waitForNextUpdate } = renderHook(
      () => useHttpRequest({ fetchOnBootstrap: true, initialData: {} }),
      {
        wrapper: HttpClientProviderConfigFixture.create(),
      }
    );

    expect(result.current[0].data).toEqual({});
    expect(result.current[0].error).toBeNull();
    expect(result.current[0].errored).toBe(false);
    expect(result.current[0].isLoading).toBe(true);
    expect(result.current[0].pristine).toBe(false);

    await waitForNextUpdate();

    expect(result.current[0].data).toEqual(fetchResponse);
    expect(result.current[0].error).toBeNull();
    expect(result.current[0].errored).toBe(false);
    expect(result.current[0].isLoading).toBe(false);
    expect(result.current[0].pristine).toBe(false);

    expect(fetch.mock.calls.length).toEqual(1);

    const [[fetchUrl, fetchParams]] = fetch.mock.calls;
    const {
      method: fetchMethod,
      headers: fetchHeaders,
      credentials: fetchCredentials,
      body: fetchBody,
      signal: fetchSignal,
    } = fetchParams || {};
    expect(fetchUrl).toBe('/');
    expect(fetchMethod).toBe(HttpMethod.Get);
    expect(fetchHeaders).toEqual(defaultHttpReqConfig.reqOptions.headers);
    expect(fetchCredentials).toBeUndefined();
    expect(fetchBody).toBeNull();
    expect(fetchSignal).toBeInstanceOf(AbortSignal);
  });

  test('should merge params provided on hook declaration with the ones provided on request run', async () => {
    fetch.mockResponseOnce('Phelony');

    const { result } = renderHook(
      () =>
        useHttpRequest({
          baseUrlOverride: 'https://phelony.com',
          relativeUrl: 'api/v1',
          parser: (res: Response) => res.text(),
          requestOptions: {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        }),
      {
        wrapper: HttpClientProviderConfigFixture.create(),
      }
    );

    const [, performRequest] = result.current;

    expect(result.current[0].data).toBeUndefined();
    expect(result.current[0].error).toBeNull();
    expect(result.current[0].errored).toBe(false);
    expect(result.current[0].isLoading).toBe(false);
    expect(result.current[0].pristine).toBe(true);

    let reqResult: Promise<string>;
    act(() => {
      const { reqResult: performRequestRes } = performRequest();
      reqResult = performRequestRes;
    });

    expect(result.current[0].data).toBeUndefined();
    expect(result.current[0].error).toBeNull();
    expect(result.current[0].errored).toBe(false);
    expect(result.current[0].isLoading).toBe(true);
    expect(result.current[0].pristine).toBe(false);

    await act(async () => {
      const res = await reqResult;
      expect(res).toBe('Phelony');
    });

    expect(result.current[0].data).toBe('Phelony');
    expect(result.current[0].error).toBeNull();
    expect(result.current[0].errored).toBe(false);
    expect(result.current[0].isLoading).toBe(false);
    expect(result.current[0].pristine).toBe(false);

    expect(fetch.mock.calls.length).toEqual(1);

    const [[fetchUrl, fetchParams]] = fetch.mock.calls;
    const {
      method: fetchMethod,
      headers: fetchHeaders,
      credentials: fetchCredentials,
      body: fetchBody,
      signal: fetchSignal,
    } = fetchParams || {};
    expect(fetchUrl).toBe('https://phelony.com/api/v1');
    expect(fetchMethod).toBe(HttpMethod.Get);
    expect(fetchHeaders).toEqual({
      'Content-Type': 'application/json',
    });
    expect(fetchCredentials).toBeUndefined();
    expect(fetchBody).toBeNull();
    expect(fetchSignal).toBeInstanceOf(AbortSignal);
  });

  test('should allow to abort the request', async () => {
    fetch.mockAbortOnce();

    const showGlobalLoader = new HttpContextToken(true);
    const reqContext = new HttpContext().set(showGlobalLoader, false);

    const { result } = renderHook(() => useHttpRequest({ context: reqContext }), {
      wrapper: HttpClientProviderConfigFixture.create(),
    });

    const [, performRequest] = result.current;

    expect(result.current[0].data).toBeUndefined();
    expect(result.current[0].error).toBeNull();
    expect(result.current[0].errored).toBe(false);
    expect(result.current[0].isLoading).toBe(false);
    expect(result.current[0].pristine).toBe(true);

    let reqResult: Promise<unknown>;
    act(() => {
      const { reqResult: performRequestRes, abortController } = performRequest();
      abortController.abort();
      reqResult = performRequestRes;
    });

    expect(result.current[0].data).toBeUndefined();
    expect(result.current[0].error).toBeNull();
    expect(result.current[0].errored).toBe(false);
    expect(result.current[0].isLoading).toBe(true);
    expect(result.current[0].pristine).toBe(false);

    let caughtError;

    await act(async () => {
      try {
        await reqResult;
      } catch (error) {
        caughtError = error;
        expect(error).toBeInstanceOf(HttpError);
        expect(error.status).toBeUndefined();
        expect(error.statsuText).toBeUndefined();
        expect(error.response).toBeUndefined();
        expect(error.message.trim()).toBe('The operation was aborted.');
        expect(error.request.url).toBe('/');
        expect(error.request.context).toBe(reqContext);
        expect(error.nativeError.name).toBe('AbortError');
      }
    });

    expect(result.current[0].data).toBeUndefined();
    expect(result.current[0].error).toEqual(caughtError);
    expect(result.current[0].errored).toBe(true);
    expect(result.current[0].isLoading).toBe(false);
    expect(result.current[0].pristine).toBe(false);

    expect(fetch.mock.calls.length).toEqual(1);

    const [[fetchUrl, fetchParams]] = fetch.mock.calls;
    const {
      method: fetchMethod,
      headers: fetchHeaders,
      credentials: fetchCredentials,
      body: fetchBody,
      signal: fetchSignal,
    } = fetchParams || {};
    expect(fetchUrl).toBe('/');
    expect(fetchMethod).toBe(HttpMethod.Get);
    expect(fetchHeaders).toEqual(defaultHttpReqConfig.reqOptions.headers);
    expect(fetchCredentials).toBeUndefined();
    expect(fetchBody).toBeNull();
    expect(fetchSignal).toBeInstanceOf(AbortSignal);
  });
});
