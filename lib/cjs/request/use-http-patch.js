"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useHttpPatch = void 0;
var _1 = require(".");
var enum_1 = require("../enum");
var use_overrided_params_by_method_1 = require("./use-overrided-params-by-method");
var useHttpPatch = function (params) {
    var overridedParams = (0, use_overrided_params_by_method_1.useOverridedParamsByMethod)(params, enum_1.HttpMethod.Patch);
    return (0, _1.useHttpRequest)(overridedParams);
};
exports.useHttpPatch = useHttpPatch;
