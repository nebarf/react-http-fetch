import { DependencyList, EffectCallback } from 'react';
export declare type DepsAreEqual = (prevDeps: DependencyList, nextDeps: DependencyList) => boolean;
export declare function useCompareEffect(callback: EffectCallback, deps: DependencyList, compare: DepsAreEqual): void;
