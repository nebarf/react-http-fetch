import { HttpCacheFixture } from './fixtures/http-cache.fixture';
import { HttpRequestFixture } from './fixtures/http-request.fixture';

describe('http-fetch', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');
  });

  test('should return undefined if no cached entry is found for the given identifier', () => {
    const httpCache = HttpCacheFixture.create();
    const httpRequest = HttpRequestFixture.create();
    const cachedEntry = httpCache.get(httpRequest);

    expect(cachedEntry).toBeUndefined();
  });

  test('should return the cached entry corresponding to the provided identifier', () => {
    const httpCache = HttpCacheFixture.create();
    const httpRequest = HttpRequestFixture.create({
      ...HttpRequestFixture.defaultOptions,
      maxAge: 6000,
    });

    const cachedResponse = { name: 'Phelony' };

    httpCache.put(httpRequest, cachedResponse);
    const expiredCachedResponse = httpCache.get<{ name: string }>(httpRequest);

    expect(expiredCachedResponse).toEqual(cachedResponse);
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 6000);
  });

  test('should remove the cached entry once expired', () => {
    const httpCache = HttpCacheFixture.create();
    const httpRequest = HttpRequestFixture.create({
      ...HttpRequestFixture.defaultOptions,
      maxAge: 6000,
    });

    const httpResponse = { name: 'Phelony' };

    httpCache.put(httpRequest, httpResponse);
    const cachedResponse = httpCache.get<{ name: string }>(httpRequest);

    expect(cachedResponse).toEqual(httpResponse);
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 6000);

    jest.runOnlyPendingTimers();
    const expiredCachedResponse = httpCache.get<{ name: string }>(httpRequest);
    expect(expiredCachedResponse).toBeUndefined();
  });

  test('should tell if a cached response for a given request is expired', () => {
    const httpCache = HttpCacheFixture.create();
    const httpRequest = HttpRequestFixture.create({
      ...HttpRequestFixture.defaultOptions,
      maxAge: 6000,
    });

    httpCache.put(httpRequest, {});
    expect(httpCache.isExpired(httpRequest)).toBe(false);

    jest.runOnlyPendingTimers();
    expect(httpCache.isExpired(httpRequest)).toBe(true);
  });

  test('should tell if there is a cached response for the given request', () => {
    const httpCache = HttpCacheFixture.create();
    const httpRequest = HttpRequestFixture.create({
      ...HttpRequestFixture.defaultOptions,
      maxAge: 6000,
    });

    httpCache.put(httpRequest, {});
    expect(httpCache.has(httpRequest)).toBe(true);

    jest.runOnlyPendingTimers();
    expect(httpCache.has(httpRequest)).toBe(false);
  });

  test('should prune the cache by removing any expired entry', () => {
    const httpCache = HttpCacheFixture.create();
    const httpRequest = HttpRequestFixture.create({
      ...HttpRequestFixture.defaultOptions,
      maxAge: 6000,
    });

    httpCache.put(httpRequest, {});
    expect(httpCache.has(httpRequest)).toBe(true);

    jest.runOnlyPendingTimers();
    expect(httpCache.has(httpRequest)).toBe(false);
  });

  test('should flush the cache by removing all entries', () => {
    const httpCache = HttpCacheFixture.create();
    const firstHttpRequest = HttpRequestFixture.create({
      ...HttpRequestFixture.defaultOptions,
      maxAge: 6000,
      relativeUrl: 'posts',
    });
    const secondHttpRequest = HttpRequestFixture.create({
      ...HttpRequestFixture.defaultOptions,
      maxAge: 6000,
      relativeUrl: 'comments',
    });

    httpCache.put(firstHttpRequest, {});
    httpCache.put(secondHttpRequest, {});

    expect(httpCache.has(firstHttpRequest)).toBe(true);
    expect(httpCache.has(secondHttpRequest)).toBe(true);

    httpCache.flush();
    expect(httpCache.has(firstHttpRequest)).toBe(false);
    expect(httpCache.has(secondHttpRequest)).toBe(false);
  });
});
