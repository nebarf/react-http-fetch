"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCompareCallback = void 0;
var react_1 = require("react");
function useCompareCallback(callback, deps, compare) {
    var depsRef = (0, react_1.useRef)();
    if (!depsRef.current || !compare(depsRef.current, deps)) {
        depsRef.current = deps;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return (0, react_1.useCallback)(callback, depsRef.current);
}
exports.useCompareCallback = useCompareCallback;
