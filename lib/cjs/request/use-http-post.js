"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useHttpPost = void 0;
var _1 = require(".");
var enum_1 = require("../enum");
var use_overrided_params_by_method_1 = require("./use-overrided-params-by-method");
var useHttpPost = function (params) {
    var overridedParams = (0, use_overrided_params_by_method_1.useOverridedParamsByMethod)(params, enum_1.HttpMethod.Post);
    return (0, _1.useHttpRequest)(overridedParams);
};
exports.useHttpPost = useHttpPost;
