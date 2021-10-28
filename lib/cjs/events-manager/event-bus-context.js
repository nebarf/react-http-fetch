"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEventBus = exports.EventBusContext = void 0;
var react_1 = require("react");
var event_bus_1 = require("./event-bus");
var eventBus = new event_bus_1.EventBus();
/**
 * The EventBus context.
 */
exports.EventBusContext = (0, react_1.createContext)(eventBus);
var useEventBus = function () {
    return (0, react_1.useContext)(exports.EventBusContext);
};
exports.useEventBus = useEventBus;
