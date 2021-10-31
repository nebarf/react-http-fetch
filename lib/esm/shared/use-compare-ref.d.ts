import { DependencyList, MutableRefObject } from 'react';
export declare type DepsAreEqual = (prevDeps: DependencyList, nextDeps: DependencyList) => boolean;
export declare function useCompareRef(deps: DependencyList, compare: DepsAreEqual): MutableRefObject<DependencyList>;
