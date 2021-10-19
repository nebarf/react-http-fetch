import { useEffect, useRef } from 'react';
import { useHttpClientConfig } from '../../providers/config/http-client-config-provider';
export var useHttpInterceptor = function (_a) {
    var handler = _a.handler;
    /**
     * The http client config.
     */
    var _b = useHttpClientConfig(), deregisterInterceptor = _b.deregisterInterceptor, registerInterceptor = _b.registerInterceptor;
    /**
     * A reference to the previous registered handler.
     */
    var prevHandlerRef = useRef();
    /**
     * Listens to any changes to the handler in order to deregister
     * the prev handler and register the new one.
     */
    useEffect(function () {
        if (prevHandlerRef.current) {
            deregisterInterceptor(prevHandlerRef.current);
        }
        registerInterceptor(handler);
        prevHandlerRef.current = handler;
    }, [deregisterInterceptor, registerInterceptor, handler]);
};
