import { DependencyList } from 'react';
export declare type DepsAreEqual = (prevDeps: DependencyList, nextDeps: DependencyList) => boolean;
export declare function useCompareCallback<T extends (...args: unknown[]) => unknown>(callback: T, deps: DependencyList, compare: DepsAreEqual): T;
