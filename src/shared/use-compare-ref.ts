import { DependencyList, MutableRefObject, useRef } from 'react';
import { DepsAreEqual } from './types';

export function useCompareRef(
  deps: DependencyList,
  compare: DepsAreEqual
): MutableRefObject<DependencyList> {
  const depsRef = useRef<DependencyList>(deps);

  if (!depsRef.current || !compare(depsRef.current, deps)) {
    depsRef.current = deps;
  }

  return depsRef;
}
