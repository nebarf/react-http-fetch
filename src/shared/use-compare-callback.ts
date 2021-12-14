import { DependencyList, useCallback } from 'react';
import { DepsAreEqual } from './types';
import { useCompareRef } from './use-compare-ref';

export function useCompareCallback<CallbackT extends (...args: unknown[]) => unknown>(
  callback: CallbackT,
  deps: DependencyList,
  compare: DepsAreEqual
): CallbackT {
  const depsRef = useCompareRef(deps, compare);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(callback, depsRef.current);
}
