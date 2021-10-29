import { DependencyList, MutableRefObject, useRef } from 'react';

export type DepsAreEqual = (prevDeps: DependencyList, nextDeps: DependencyList) => boolean;

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
