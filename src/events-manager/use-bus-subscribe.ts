import { useCompareEffect } from '../shared';
import { useRef, useCallback } from 'react';
import fastCompare from 'react-fast-compare';
import { HttpEventClassType, HttpEventHandler } from './types';
import { useEventBus } from './event-bus-context';

export const useBusSubscribe = <T>(
  eventName: HttpEventClassType<T>,
  handler: HttpEventHandler<T>
): void => {
  // The event bus.
  const eventBus = useEventBus();

  // A ref to unsubscribe from the event. It helps to avoid
  // registering the same event handler multiple times.
  const unsubscribeRef = useRef<() => void>();

  // Keeps track of the first run of the hook and the related subscription.
  const firstRunRef = useRef(true);
  const unsubcribeFirstRunRef = useRef<() => void>();

  // Subscribe to the event on first hook run. "useEffect" hook will first
  // run after component rendering, if child components cause http events to
  // be triggered they want be receveived from this subscriber.
  if (firstRunRef.current) {
    unsubcribeFirstRunRef.current = eventBus.subscribe(eventName, handler);
    firstRunRef.current = false;
  }

  /**
   * Detach the handler for the event.
   */
  const unsubscribe = useCallback(() => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = undefined;
    }
  }, []);

  /**
   * Setup the event handler.
   */
  useCompareEffect(
    () => {
      if (unsubcribeFirstRunRef.current) {
        unsubcribeFirstRunRef.current();
        unsubcribeFirstRunRef.current = undefined;
      }
      // Subscribe to the event and keep track of the subscription.
      unsubscribeRef.current = eventBus.subscribe(eventName, handler);

      // Clean up: unsubscribe the previous event handler.
      return () => {
        unsubscribe();
      };
    },
    [eventBus, eventName, handler, unsubscribe],
    fastCompare
  );
};
