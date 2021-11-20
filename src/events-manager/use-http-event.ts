import { useRef, useCallback } from 'react';
import fastCompare from 'react-fast-compare';
import { HttpEventClassType, HttpEventHandler } from './types';
import { useEventBus } from './event-bus-context';
import { useCompareLayoutEffect } from '../shared/use-compare-layout-effect';

export const useHttpEvent = <T>(
  eventType: HttpEventClassType<T>,
  handler: HttpEventHandler<T>
): void => {
  // The event bus.
  const eventBus = useEventBus();

  // A ref to unsubscribe from the event. It helps to avoid
  // registering the same event handler multiple times.
  const unsubscribeRef = useRef<() => void>();

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
  useCompareLayoutEffect(
    () => {
      // Subscribe to the event and keep track of the subscription.
      unsubscribeRef.current = eventBus.subscribe(eventType, handler);

      // Clean up: unsubscribe the previous event handler.
      return () => {
        unsubscribe();
      };
    },
    [eventBus, eventType, handler, unsubscribe],
    fastCompare
  );
};
