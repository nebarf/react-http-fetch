import { useCallback, useRef } from 'react';
export function useCompareCallback(callback, deps, compare) {
    var depsRef = useRef();
    if (!depsRef.current || !compare(depsRef.current, deps)) {
        depsRef.current = deps;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useCallback(callback, depsRef.current);
}
