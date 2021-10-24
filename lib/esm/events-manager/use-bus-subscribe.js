import { useEffect, useRef, useCallback, useContext } from 'react';
import { EventBusContext } from '.';
export var useBusSubscribe = function (eventName, handler) {
    // The event bus.
    var eventBus = useContext(EventBusContext);
    // A ref to unsubscribe from the event. It helps to avoid
    // registering the same event handler multiple times.
    var unsubscribeRef = useRef();
    /**
     * Detach the handler for the event.
     */
    var unsubscribe = useCallback(function () {
        if (unsubscribeRef.current) {
            unsubscribeRef.current();
            unsubscribeRef.current = undefined;
        }
    }, []);
    /**
     * Setup the event handler.
     */
    useEffect(function () {
        // Subscribe to the event and keep track of the subscription.
        unsubscribeRef.current = eventBus.subscribe(eventName, handler);
        // Clean up: unsubscribe the previous event handler.
        return function () {
            unsubscribe();
        };
    }, [eventBus, eventName, handler, unsubscribe]);
};
