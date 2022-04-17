import { waitFor, renderHook } from '@testing-library/react';
import { HttpMethod, useHttpPut } from '..';
import * as useHttpRequestModule from '../request/use-http-request';
import { HttpClientProviderConfigFixture } from './fixtures/http-client-config-provider.fixture';

describe('use-http-post', () => {
  it('should perform a post request', async () => {
    const useHttpRequestMock = jest.spyOn(useHttpRequestModule, 'useHttpRequest');

    const { result } = renderHook(
      () =>
        useHttpPut({
          fetchOnBootstrap: true,
          requestOptions: { body: { title: 'Phelony title' } },
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
      requestOptions: { body: { title: 'Phelony title' }, method: HttpMethod.Put },
    });
  });
});
