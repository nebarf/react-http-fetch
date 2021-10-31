import { useEffect } from 'react';
import { useCompareRef } from './use-compare-ref';
export function useCompareEffect(callback, deps, compare) {
    var depsRef = useCompareRef(deps, compare);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useEffect(callback, depsRef.current);
}
