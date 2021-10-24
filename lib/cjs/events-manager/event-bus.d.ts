import { HttpEvent, HttpEventClassType } from '.';
import { HttpEventHandler } from './types';
export declare class EventBus {
    private _subscriptions;
    /**
     * @constructor
     */
    constructor();
    /**
     * Gets the set of subscriptions associated with the provided http event class type.
     */
    private _ensureEventSubscriptionInit;
    /**
     * Gets the number of subscriptions for the given event.
     * @param {*} eventName
     */
    getEventSubscriptionsCount<T>(httpEventType: HttpEventClassType<T>): number;
    /**
     * Subscribes to an event.
     * @param {*} eventName
     * @param {*} handler
     */
    subscribe<T>(httpEventType: HttpEventClassType<T>, handler: HttpEventHandler<T>): () => void;
    /**
     * Publishes an event against to set of subscribers.
     * @param {*} eventName
     * @param {*} payload
     */
    publish<T>(httpEvent: HttpEvent<T>): void;
    /**
     * Deregister the handler for the event name.
     * @param {*} eventName
     * @param {*} subscription
     */
    unsubscribe<T>(httpEventType: HttpEventClassType<T>, handler: HttpEventHandler<T>): void;
    /**
     * Detaches all subscriptions for the given event.
     * @param {*} eventName
     */
    detachEventSubscriptions<T>(httpEventType: HttpEventClassType<T>): void;
    /**
     * Detaches the subscriptions for all registered events.
     */
    detachAll(): void;
}
