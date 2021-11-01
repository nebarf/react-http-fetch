import { DependencyList, useCallback } from 'react';
import { DepsAreEqual } from './types';
import { useCompareRef } from './use-compare-ref';

export function useCompareCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  deps: DependencyList,
  compare: DepsAreEqual
): T {
  const depsRef = useCompareRef(deps, compare);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(callback, depsRef.current);
}
