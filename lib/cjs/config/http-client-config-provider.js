"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useHttpClientConfig = exports.HttpClientConfigProvider = exports.HttpClientContext = void 0;
var react_1 = __importStar(require("react"));
var _1 = require(".");
/**
 * The context to provide the default http client configuration.
 */
exports.HttpClientContext = (0, react_1.createContext)(_1.defaultClientProps);
/**
 * The provider for the default http client configuration.
 */
var HttpClientConfigProvider = function (_a) {
    var config = _a.config, children = _a.children;
    /**
     * The merged http config.
     */
    var mergedHttpConfig = (0, react_1.useMemo)(function () { return ({
        baseUrl: config.baseUrl || _1.defaultHttpReqConfig.baseUrl,
        responseParser: config.responseParser || _1.defaultHttpReqConfig.responseParser,
        reqOptions: config.reqOptions || _1.defaultHttpReqConfig.reqOptions,
        requestBodySerializer: config.requestBodySerializer || _1.defaultHttpReqConfig.requestBodySerializer,
        cache: config.cache || _1.defaultHttpReqConfig.cache,
    }); }, [config]);
    var publicApi = (0, react_1.useMemo)(function () { return ({
        config: mergedHttpConfig,
    }); }, [mergedHttpConfig]);
    return react_1.default.createElement(exports.HttpClientContext.Provider, { value: publicApi }, children);
};
HttpClientConfigProvider.displayName = 'HttpClientProvider';
var memoizedProvider = (0, react_1.memo)(HttpClientConfigProvider);
exports.HttpClientConfigProvider = memoizedProvider;
/**
 * A utility hook to get the http client config context.
 */
var useHttpClientConfig = function () {
    var config = (0, react_1.useContext)(exports.HttpClientContext);
    return config;
};
exports.useHttpClientConfig = useHttpClientConfig;
