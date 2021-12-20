import { cleanup } from '@testing-library/react';
// import { renderHook } from '@testing-library/react-hooks';
import { FetchMock } from 'jest-fetch-mock';

const fetch = global.fetch as FetchMock;

describe('http-client-config-provider', () => {
  // const fetchResponse = {
  //   name: 'Phelony',
  //   role: 'Admin',
  // };

  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');
  });

  afterEach((): void => {
    cleanup();
    fetch.resetMocks();
    jest.runAllTimers();
  });

  // test('should override global req options', async () => {});

  // test('should override global base url', async () => {});

  // test('should override cache store', async () => {});

  // test('should override cache store prefix', async () => {});

  // test('should override cache store separator', async () => {});
});
