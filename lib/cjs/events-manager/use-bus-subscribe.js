"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBusSubscribe = void 0;
var use_compare_effect_1 = require("@/shared/use-compare-effect");
var react_1 = require("react");
var react_fast_compare_1 = __importDefault(require("react-fast-compare"));
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
            unsubscribeRef.current = undefined;
        }
    }, []);
    /**
     * Setup the event handler.
     */
    (0, use_compare_effect_1.useCompareEffect)(function () {
        // Subscribe to the event and keep track of the subscription.
        unsubscribeRef.current = eventBus.subscribe(eventName, handler);
        // Clean up: unsubscribe the previous event handler.
        return function () {
            unsubscribe();
        };
    }, [eventBus, eventName, handler, unsubscribe], react_fast_compare_1.default);
};
exports.useBusSubscribe = useBusSubscribe;
