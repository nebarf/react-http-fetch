import { DependencyList, useMemo } from 'react';
import { useCompareRef } from './use-compare-ref';

export type DepsAreEqual = (prevDeps: DependencyList, nextDeps: DependencyList) => boolean;

export function useCompareMemo<T>(
  factory: () => T,
  deps: DependencyList,
  compare: DepsAreEqual
): T {
  const depsRef = useCompareRef(deps, compare);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(factory, depsRef.current);
}
