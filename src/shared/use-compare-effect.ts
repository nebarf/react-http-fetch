import { DependencyList, EffectCallback, useEffect } from 'react';
import { useCompareRef } from './use-compare-ref';

export type DepsAreEqual = (prevDeps: DependencyList, nextDeps: DependencyList) => boolean;

export function useCompareEffect(
  callback: EffectCallback,
  deps: DependencyList,
  compare: DepsAreEqual
): void {
  const depsRef = useCompareRef(deps, compare);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useEffect(callback, depsRef.current);
}
