"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpInterceptor = void 0;
var react_1 = require("react");
var http_client_config_provider_1 = require("../../providers/config/http-client-config-provider");
var HttpInterceptor = function (_a) {
    var handler = _a.handler;
    /**
     * The http client config.
     */
    var _b = (0, http_client_config_provider_1.useHttpClientConfig)(), deregisterInterceptor = _b.deregisterInterceptor, registerInterceptor = _b.registerInterceptor;
    /**
     * A reference to the previous registered handler.
     */
    var prevHandlerRef = (0, react_1.useRef)();
    /**
     * Listens to any changes to the handler in order to deregister
     * the prev handler and register the new one.
     */
    (0, react_1.useEffect)(function () {
        if (prevHandlerRef.current) {
            deregisterInterceptor(prevHandlerRef.current);
        }
        registerInterceptor(handler);
        prevHandlerRef.current = handler;
    }, [deregisterInterceptor, registerInterceptor, handler]);
};
exports.HttpInterceptor = HttpInterceptor;
