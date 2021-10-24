"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBusSubscribe = void 0;
var react_1 = require("react");
var _1 = require(".");
var useBusSubscribe = function (eventName, handler) {
    // The event bus.
    var eventBus = (0, react_1.useContext)(_1.EventBusContext);
    // A ref to unsubscribe from the event. It helps to avoid
    // registering the same event handler multiple times.
    var unsubscribeRef = (0, react_1.useRef)();
    /**
     * Detach the handler for the event.
     */
    var unsubscribe = (0, react_1.useCallback)(function () {
        if (unsubscribeRef.current) {
            unsubscribeRef.current();
        }
    }, []);
    // Setup the event handler.
    (0, react_1.useEffect)(function () {
        // Unsubscribe the previous event handler.
        unsubscribe();
        // Subscribe to the event and keep track of the subscription.
        unsubscribeRef.current = eventBus.subscribe(eventName, handler);
    }, [eventBus, eventName, handler, unsubscribe]);
    (0, react_1.useEffect)(function () { return function () {
        // Cleanup.
        unsubscribe();
    }; }, [unsubscribe]);
};
exports.useBusSubscribe = useBusSubscribe;
