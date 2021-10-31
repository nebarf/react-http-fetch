"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCompareEffect = void 0;
var react_1 = require("react");
var use_compare_ref_1 = require("./use-compare-ref");
function useCompareEffect(callback, deps, compare) {
    var depsRef = (0, use_compare_ref_1.useCompareRef)(deps, compare);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return (0, react_1.useEffect)(callback, depsRef.current);
}
exports.useCompareEffect = useCompareEffect;
