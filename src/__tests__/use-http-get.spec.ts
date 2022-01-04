import { renderHook } from '@testing-library/react-hooks';
import { HttpMethod, useHttpGet } from '..';
import * as useHttpRequestModule from '../request/use-http-request';
import { HttpClientProviderConfigFixture } from './fixtures/http-client-config-provider.fixture';

describe('use-http-post', () => {
  it('should perform a post request', async () => {
    const useHttpRequestMock = jest.spyOn(useHttpRequestModule, 'useHttpRequest');

    const { waitForNextUpdate } = renderHook(
      () =>
        useHttpGet({
          fetchOnBootstrap: true,
          relativeUrl: 'posts',
        }),
      {
        wrapper: HttpClientProviderConfigFixture.create(),
      }
    );

    await waitForNextUpdate();
    // It's called everytime the state is updated.
    expect(useHttpRequestMock).toHaveBeenCalledTimes(3);
    expect(useHttpRequestMock).toHaveBeenCalledWith({
      fetchOnBootstrap: true,
      relativeUrl: 'posts',
      requestOptions: { method: HttpMethod.Get },
    });
  });
});
