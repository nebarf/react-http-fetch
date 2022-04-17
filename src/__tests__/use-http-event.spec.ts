import { cleanup, renderHook, act } from '@testing-library/react';
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
  RequestSuccededEventPayload,
  useHttpEvent,
  useHttpRequest,
} from '..';
import { HttpClientProviderConfigFixture } from './fixtures/http-client-config-provider.fixture';

const fetch = global.fetch as FetchMock;

interface FetchResponse {
  name: string;
  role: string;
}

describe('use-http-event', () => {
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

  it('should run the registered handler when a request starts', (done) => {
    fetch.mockResponseOnce(JSON.stringify(fetchResponse));

    const showGlobalLoader = new HttpContextToken(true);
    const reqContext = new HttpContext().set(showGlobalLoader, false);

    renderHook(
      () =>
        useHttpEvent(RequestStartedEvent, (request: HttpRequest<void>) => {
          try {
            expect(request.url).toBe('https://phelony.com/comments');
            expect(request.baseUrl).toBe('https://phelony.com');
            expect(request.relativeUrl).toBe('comments');
            expect(request.body).toBeUndefined();
            expect(request.headers).toEqual(defaultHttpReqConfig.reqOptions.headers);
            expect(request.context).toBe(reqContext);
            expect(request.getContextValue(showGlobalLoader)).toBe(false);
            expect(request.credentials).toBeUndefined();
            expect(request.maxAge).toBe(0);
            expect(request.method).toBe(HttpMethod.Get);
            expect(request.queryParams).toBeUndefined();
            expect(request.serializedQueryParams).toBe('');
            expect(request.signal).toBeInstanceOf(AbortSignal);
            expect(request.urlWithParams).toBe('https://phelony.com/comments');
            done();
          } catch (expectError) {
            done(expectError);
          }
        }),
      {
        wrapper: HttpClientProviderConfigFixture.create(),
      }
    );

    const { result } = renderHook(
      () =>
        useHttpRequest<{ name: string; role: string }>({
          baseUrlOverride: 'https://phelony.com',
          relativeUrl: 'comments',
          context: reqContext,
        }),
      {
        wrapper: HttpClientProviderConfigFixture.create(),
      }
    );

    const [, performRequest] = result.current;

    (async () => {
      await act(async () => {
        await performRequest();
      });
    })();
  });

  it('should run the registered handler when a request goes in error', (done) => {
    const fetchError = new Error('Fetch error');
    fetch.mockRejectOnce(fetchError);

    const showGlobalLoader = new HttpContextToken(true);
    const reqContext = new HttpContext().set(showGlobalLoader, false);

    renderHook(
      () =>
        useHttpEvent(RequestErroredEvent, (error: HttpError<FetchResponse, void>) => {
          try {
            expect(error.status).toBeUndefined();
            expect(error.statusText).toBeUndefined();
            expect(error.response).toBeUndefined();
            expect(error.nativeError).toBe(fetchError);
            expect(error.request?.url).toBe('https://phelony.com/comments');
            expect(error.request?.baseUrl).toBe('https://phelony.com');
            expect(error.request?.relativeUrl).toBe('comments');
            expect(error.request?.body).toBeUndefined();
            expect(error.request?.headers).toEqual(defaultHttpReqConfig.reqOptions.headers);
            expect(error.request?.context).toBe(reqContext);
            expect(error.request?.getContextValue(showGlobalLoader)).toBe(false);
            expect(error.request?.credentials).toBeUndefined();
            expect(error.request?.maxAge).toBe(0);
            expect(error.request?.method).toBe(HttpMethod.Get);
            expect(error.request?.queryParams).toBeUndefined();
            expect(error.request?.serializedQueryParams).toBe('');
            expect(error.request?.signal).toBeInstanceOf(AbortSignal);
            expect(error.request?.urlWithParams).toBe('https://phelony.com/comments');
            done();
          } catch (expectError) {
            done(expectError);
          }
        }),
      {
        wrapper: HttpClientProviderConfigFixture.create(),
      }
    );
    const { result } = renderHook(
      () =>
        useHttpRequest<{ name: string; role: string }>({
          baseUrlOverride: 'https://phelony.com',
          relativeUrl: 'comments',
          context: reqContext,
        }),
      {
        wrapper: HttpClientProviderConfigFixture.create(),
      }
    );
    const [, performRequest] = result.current;
    (async () => {
      await act(async () => {
        try {
          await performRequest();
        } catch (error) {}
      });
    })();
  });

  it('should run the registered handler when a request completes', (done) => {
    fetch.mockResponseOnce(JSON.stringify(fetchResponse));

    const showGlobalLoader = new HttpContextToken(true);
    const reqContext = new HttpContext().set(showGlobalLoader, false);

    renderHook(
      () =>
        useHttpEvent(
          RequestSuccededEvent,
          ({ request, response }: RequestSuccededEventPayload<FetchResponse, void>) => {
            try {
              expect(request.url).toBe('https://phelony.com/comments');
              expect(request.baseUrl).toBe('https://phelony.com');
              expect(request.relativeUrl).toBe('comments');
              expect(request.body).toBeUndefined();
              expect(request.headers).toEqual(defaultHttpReqConfig.reqOptions.headers);
              expect(request.context).toBe(reqContext);
              expect(request.getContextValue(showGlobalLoader)).toBe(false);
              expect(request.credentials).toBeUndefined();
              expect(request.maxAge).toBe(0);
              expect(request.method).toBe(HttpMethod.Get);
              expect(request.queryParams).toBeUndefined();
              expect(request.serializedQueryParams).toBe('');
              expect(request.signal).toBeInstanceOf(AbortSignal);
              expect(request.urlWithParams).toBe('https://phelony.com/comments');
              expect(response).toEqual(fetchResponse);
              done();
            } catch (expectError) {
              done(expectError);
            }
          }
        ),
      {
        wrapper: HttpClientProviderConfigFixture.create(),
      }
    );

    const { result } = renderHook(
      () =>
        useHttpRequest<FetchResponse>({
          baseUrlOverride: 'https://phelony.com',
          relativeUrl: 'comments',
          context: reqContext,
        }),
      {
        wrapper: HttpClientProviderConfigFixture.create(),
      }
    );

    const [, performRequest] = result.current;

    (async () => {
      await act(async () => {
        await performRequest();
      });
    })();
  });
});
