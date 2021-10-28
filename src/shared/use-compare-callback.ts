import { DependencyList, useCallback, useRef } from 'react';

export type DepsAreEqual = (prevDeps: DependencyList, nextDeps: DependencyList) => boolean;

export function useCompareCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  deps: DependencyList,
  compare: DepsAreEqual
): T {
  const depsRef = useRef<DependencyList | undefined>();

  if (!depsRef.current || !compare(depsRef.current, deps)) {
    depsRef.current = deps;
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(callback, depsRef.current);
}
