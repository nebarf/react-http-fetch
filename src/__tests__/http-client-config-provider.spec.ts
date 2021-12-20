import { cleanup } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { FetchMock } from 'jest-fetch-mock';
import { mock } from 'jest-mock-extended';
import { defaultHttpReqConfig, HttpCacheStore, HttpMethod, useHttpClient } from '..';
import { HttpInMemoryCacheStore } from '../cache/http-in-memory-cache-store';
import { HttpClientProviderConfigFixture } from './fixtures/http-client-config-provider.fixture';

jest.mock('../cache/http-in-memory-cache-store');
const MockedHttpInMemoryCacheStore = <jest.Mock<HttpInMemoryCacheStore>>HttpInMemoryCacheStore;
const [inMemoryCacheMockInstance] = MockedHttpInMemoryCacheStore.mock.instances;

const fetch = global.fetch as FetchMock;

describe('http-client-config-provider', () => {
  const fetchResponse = {
    name: 'Phelony',
    role: 'Admin',
  };

  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');
    (inMemoryCacheMockInstance.get as jest.Mock).mockClear();
    (inMemoryCacheMockInstance.put as jest.Mock).mockClear();
  });

  afterEach((): void => {
    cleanup();
    fetch.resetMocks();
    jest.runAllTimers();
  });

  test('should override global req options', async () => {
    fetch.mockResponseOnce(JSON.stringify(fetchResponse));

    const customReqOpts = {
      headers: {
        'Content-Type': 'text/html; charset=UTF-8',
      },
    };

    const { result } = renderHook(() => useHttpClient(), {
      wrapper: HttpClientProviderConfigFixture.create({
        reqOptions: customReqOpts,
      }),
    });

    const { get } = result.current;

    const res1 = await get({
      relativeUrl: 'posts/1',
    });

    expect(res1).toEqual(fetchResponse);

    const [[fetchUrl, fetchParams]] = fetch.mock.calls;
    const {
      method: fetchMethod,
      headers: fetchHeaders,
      credentials: fetchCredentials,
      body: fetchBody,
      signal: fetchSignal,
    } = fetchParams || {};

    expect(fetchUrl).toBe('/posts/1');
    expect(fetchMethod).toBe(HttpMethod.Get);
    expect(fetchHeaders).toEqual(customReqOpts.headers);
    expect(fetchCredentials).toBeUndefined();
    expect(fetchBody).toBeNull();
    expect(fetchSignal).toBeUndefined();
  });

  test('should override global base url', async () => {
    fetch.mockResponseOnce(JSON.stringify(fetchResponse));
    const customBaseUrl = 'http://phelony.com';

    const { result } = renderHook(() => useHttpClient(), {
      wrapper: HttpClientProviderConfigFixture.create({
        baseUrl: 'http://phelony.com',
      }),
    });

    const { get } = result.current;

    const res1 = await get({
      relativeUrl: 'posts/1',
    });

    expect(res1).toEqual(fetchResponse);

    const [[fetchUrl, fetchParams]] = fetch.mock.calls;
    const {
      method: fetchMethod,
      headers: fetchHeaders,
      credentials: fetchCredentials,
      body: fetchBody,
      signal: fetchSignal,
    } = fetchParams || {};

    expect(fetchUrl).toBe(`${customBaseUrl}/posts/1`);
    expect(fetchMethod).toBe(HttpMethod.Get);
    expect(fetchHeaders).toEqual(defaultHttpReqConfig.reqOptions.headers);
    expect(fetchCredentials).toBeUndefined();
    expect(fetchBody).toBeNull();
    expect(fetchSignal).toBeUndefined();
  });

  test('should override cache store', async () => {
    fetch.mockResponseOnce(JSON.stringify(fetchResponse));
    const customBaseUrl = 'http://phelony.com';

    const httpCacheStoreMock = mock<HttpCacheStore>();

    const { result } = renderHook(() => useHttpClient(), {
      wrapper: HttpClientProviderConfigFixture.create({
        baseUrl: 'http://phelony.com',
        cacheStore: httpCacheStoreMock,
      }),
    });

    const { get } = result.current;

    const res1 = await get({
      relativeUrl: 'posts/1',
      requestOptions: {
        queryParams: { orderBy: 'title' },
        maxAge: 1000,
      },
    });

    expect(res1).toEqual(fetchResponse);

    const [[fetchUrl, fetchParams]] = fetch.mock.calls;
    const {
      method: fetchMethod,
      headers: fetchHeaders,
      credentials: fetchCredentials,
      body: fetchBody,
      signal: fetchSignal,
    } = fetchParams || {};

    expect(fetchUrl).toBe(`${customBaseUrl}/posts/1?orderBy=title`);
    expect(fetchMethod).toBe(HttpMethod.Get);
    expect(fetchHeaders).toEqual(defaultHttpReqConfig.reqOptions.headers);
    expect(fetchCredentials).toBeUndefined();
    expect(fetchBody).toBeNull();
    expect(fetchSignal).toBeUndefined();

    expect(httpCacheStoreMock.get).toHaveBeenCalledTimes(1);
    expect(httpCacheStoreMock.get).toHaveBeenCalledWith(
      'rhf__http://phelony.com/posts/1?orderBy=title'
    );

    // expect(httpCacheStoreMock.put).toHaveBeenCalledTimes(1);
  });

  test('should override cache store prefix and separator', async () => {
    fetch.mockResponseOnce(JSON.stringify(fetchResponse));
    const customBaseUrl = 'http://phelony.com';

    const { result } = renderHook(() => useHttpClient(), {
      wrapper: HttpClientProviderConfigFixture.create({
        baseUrl: 'http://phelony.com',
        cacheStorePrefix: 'phy',
        cacheStoreSeparator: '--',
      }),
    });

    const { get } = result.current;

    const res1 = await get({
      relativeUrl: 'posts/1',
      requestOptions: { maxAge: 1000 },
    });

    expect(res1).toEqual(fetchResponse);

    const [[fetchUrl, fetchParams]] = fetch.mock.calls;
    const {
      method: fetchMethod,
      headers: fetchHeaders,
      credentials: fetchCredentials,
      body: fetchBody,
      signal: fetchSignal,
    } = fetchParams || {};

    expect(fetchUrl).toBe(`${customBaseUrl}/posts/1`);
    expect(fetchMethod).toBe(HttpMethod.Get);
    expect(fetchHeaders).toEqual(defaultHttpReqConfig.reqOptions.headers);
    expect(fetchCredentials).toBeUndefined();
    expect(fetchBody).toBeNull();
    expect(fetchSignal).toBeUndefined();

    expect(inMemoryCacheMockInstance.get).toHaveBeenCalledTimes(1);
    expect(inMemoryCacheMockInstance.get).toHaveBeenCalledWith('phy--http://phelony.com/posts/1');

    expect(inMemoryCacheMockInstance.put).toHaveBeenCalledTimes(1);
  });
});
