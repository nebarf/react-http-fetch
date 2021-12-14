import { HttpEvent } from './events';
import { HttpEventHandler, HttpEventClassType } from './types';

export class EventBus {
  private _subscriptions: Map<HttpEventClassType<unknown>, Set<HttpEventHandler<unknown>>>;

  /**
   * @constructor
   */
  constructor() {
    this._subscriptions = new Map();
  }

  /**
   * Gets the set of subscriptions associated with the provided http event class type.
   */
  private _ensureEventSubscriptionInit<PayloadT>(
    httpEventType: HttpEventClassType<PayloadT>
  ): Set<HttpEventHandler<PayloadT>> {
    const currentEventSubscriptions = this._subscriptions.get(httpEventType);
    if (currentEventSubscriptions) {
      return currentEventSubscriptions;
    }

    const newEventSubscriptionsSet = new Set<HttpEventHandler<PayloadT>>();
    this._subscriptions.set(httpEventType, newEventSubscriptionsSet);
    return newEventSubscriptionsSet;
  }

  /**
   * Gets the number of subscriptions for the given event.
   * @param {*} eventName
   */
  getEventSubscriptionsCount<PayloadT>(httpEventType: HttpEventClassType<PayloadT>): number {
    const eventSubscriptions = this._subscriptions.get(httpEventType);
    return eventSubscriptions ? eventSubscriptions.size : 0;
  }

  /**
   * Subscribes to an event.
   * @param {*} eventName
   * @param {*} handler
   */
  subscribe<PayloadT>(
    httpEventType: HttpEventClassType<PayloadT>,
    handler: HttpEventHandler<PayloadT>
  ): () => void {
    const eventSubscriptions = this._ensureEventSubscriptionInit(httpEventType);
    eventSubscriptions.add(handler);

    return () => this.unsubscribe(httpEventType, handler);
  }

  /**
   * Publishes an event against to set of subscribers.
   * @param {*} eventName
   * @param {*} payload
   */
  publish<PayloadT>(httpEvent: HttpEvent<PayloadT>): void {
    const httpEventType = httpEvent.constructor as HttpEventClassType<PayloadT>;
    // Do nothing if the subscriptions set for the given event is empty.
    const eventHandlers = this._subscriptions.get(httpEventType);
    if (!eventHandlers || eventHandlers.size === 0) {
      return;
    }
    // Otherwise call each handler registered for the given event.
    eventHandlers.forEach((handler) => handler(httpEvent.payload));
  }

  /**
   * Deregister the handler for the event name.
   * @param {*} eventName
   * @param {*} subscription
   */
  unsubscribe<PayloadT>(
    httpEventType: HttpEventClassType<PayloadT>,
    handler: HttpEventHandler<PayloadT>
  ): void {
    const eventSubscriptionsSet = this._subscriptions.get(httpEventType);
    if (!eventSubscriptionsSet || eventSubscriptionsSet.size === 0) {
      return;
    }

    eventSubscriptionsSet.delete(handler);

    if (eventSubscriptionsSet.size === 0) {
      this._subscriptions.delete(httpEventType);
    }
  }

  /**
   * Detaches all subscriptions for the given event.
   * @param {*} eventName
   */
  detachEventSubscriptions<PayloadT>(httpEventType: HttpEventClassType<PayloadT>): void {
    if (!this._subscriptions.has(httpEventType)) {
      return;
    }
    this._subscriptions.delete(httpEventType);
  }

  /**
   * Detaches the subscriptions for all registered events.
   */
  detachAll(): void {
    this._subscriptions.clear();
  }
}
