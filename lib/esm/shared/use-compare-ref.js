import { useRef } from 'react';
export function useCompareRef(deps, compare) {
    var depsRef = useRef(deps);
    if (!depsRef.current || !compare(depsRef.current, deps)) {
        depsRef.current = deps;
    }
    return depsRef;
}
