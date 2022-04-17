import { enableFetchMocks } from 'jest-fetch-mock';
import { renderHook } from '@testing-library/react-hooks';

if (process.env.REACT_VERSION === 'v17') {
  jest.mock('@testing-library/react', () => ({
    ...(jest.requireActual('@testing-library/react') as Record<string, unknown>),
    renderHook,
  }));
}

enableFetchMocks();
