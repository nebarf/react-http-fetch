import { createContext, useContext } from 'react';
import { EventBus } from './event-bus';
var eventBus = new EventBus();
/**
 * The EventBus context.
 */
export var EventBusContext = createContext(eventBus);
export var useEventBus = function () {
    return useContext(EventBusContext);
};
