"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventBus = void 0;
var EventBus = /** @class */ (function () {
    /**
     * @constructor
     */
    function EventBus() {
        this._subscriptions = new Map();
    }
    /**
     * Gets the set of subscriptions associated with the provided http event class type.
     */
    EventBus.prototype._ensureEventSubscriptionInit = function (httpEventType) {
        var currentEventSubscriptions = this._subscriptions.get(httpEventType);
        if (currentEventSubscriptions) {
            return currentEventSubscriptions;
        }
        var newEventSubscriptionsSet = new Set();
        this._subscriptions.set(httpEventType, newEventSubscriptionsSet);
        return newEventSubscriptionsSet;
    };
    /**
     * Gets the number of subscriptions for the given event.
     * @param {*} eventName
     */
    EventBus.prototype.getEventSubscriptionsCount = function (httpEventType) {
        var eventSubscriptions = this._subscriptions.get(httpEventType);
        return eventSubscriptions ? eventSubscriptions.size : 0;
    };
    /**
     * Subscribes to an event.
     * @param {*} eventName
     * @param {*} handler
     */
    EventBus.prototype.subscribe = function (httpEventType, handler) {
        var _this = this;
        var eventSubscriptions = this._ensureEventSubscriptionInit(httpEventType);
        eventSubscriptions.add(handler);
        return function () { return _this.unsubscribe(httpEventType, handler); };
    };
    /**
     * Publishes an event against to set of subscribers.
     * @param {*} eventName
     * @param {*} payload
     */
    EventBus.prototype.publish = function (httpEvent) {
        var httpEventType = httpEvent.constructor;
        // Do nothing if the subscriptions set for the given event is empty.
        var eventHandlers = this._subscriptions.get(httpEventType);
        if (!eventHandlers || eventHandlers.size === 0) {
            return;
        }
        // Otherwise call each handler registered for the given event.
        eventHandlers.forEach(function (handler) { return handler(httpEvent.payload); });
    };
    /**
     * Deregister the handler for the event name.
     * @param {*} eventName
     * @param {*} subscription
     */
    EventBus.prototype.unsubscribe = function (httpEventType, handler) {
        var eventSubscriptionsSet = this._subscriptions.get(httpEventType);
        if (!eventSubscriptionsSet || eventSubscriptionsSet.size === 0) {
            return;
        }
        eventSubscriptionsSet.delete(handler);
        if (eventSubscriptionsSet.size === 0) {
            this._subscriptions.delete(httpEventType);
        }
    };
    /**
     * Detaches all subscriptions for the given event.
     * @param {*} eventName
     */
    EventBus.prototype.detachEventSubscriptions = function (httpEventType) {
        if (!this._subscriptions.has(httpEventType)) {
            return;
        }
        this._subscriptions.delete(httpEventType);
    };
    /**
     * Detaches the subscriptions for all registered events.
     */
    EventBus.prototype.detachAll = function () {
        this._subscriptions.clear();
    };
    return EventBus;
}());
exports.EventBus = EventBus;
