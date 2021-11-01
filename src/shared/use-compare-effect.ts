import { DependencyList, EffectCallback, useEffect } from 'react';
import { DepsAreEqual } from './types';
import { useCompareRef } from './use-compare-ref';

export function useCompareEffect(
  callback: EffectCallback,
  deps: DependencyList,
  compare: DepsAreEqual
): void {
  const depsRef = useCompareRef(deps, compare);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useEffect(callback, depsRef.current);
}
