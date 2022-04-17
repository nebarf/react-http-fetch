import { waitFor, renderHook } from '@testing-library/react';
import { HttpMethod, useHttpDelete } from '..';
import * as useHttpRequestModule from '../request/use-http-request';
import { HttpClientProviderConfigFixture } from './fixtures/http-client-config-provider.fixture';

describe('use-http-post', () => {
  it('should perform a post request', async () => {
    const useHttpRequestMock = jest.spyOn(useHttpRequestModule, 'useHttpRequest');

    const { result } = renderHook(
      () =>
        useHttpDelete({
          fetchOnBootstrap: true,
          relativeUrl: 'posts/1',
        }),
      {
        wrapper: HttpClientProviderConfigFixture.create(),
      }
    );

    expect(result.current[0].isLoading).toBe(true);

    await waitFor(
      () => {
        expect(result.current[0].isLoading).toBe(false);
      },
      { interval: 1 }
    );

    // It's called everytime the state is updated.
    expect(useHttpRequestMock).toHaveBeenCalledTimes(3);
    expect(useHttpRequestMock).toHaveBeenCalledWith({
      fetchOnBootstrap: true,
      relativeUrl: 'posts/1',
      requestOptions: { method: HttpMethod.Delete },
    });
  });
});
