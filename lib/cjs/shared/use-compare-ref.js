"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCompareRef = void 0;
var react_1 = require("react");
function useCompareRef(deps, compare) {
    var depsRef = (0, react_1.useRef)(deps);
    if (!depsRef.current || !compare(depsRef.current, deps)) {
        depsRef.current = deps;
    }
    return depsRef;
}
exports.useCompareRef = useCompareRef;
