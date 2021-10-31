import { useCompareEffect } from '@/shared/use-compare-effect';
import { useRef, useCallback, useContext } from 'react';
import fastCompare from 'react-fast-compare';
import { HttpEventClassType, HttpEventHandler } from './types';
import { EventBusContext } from './event-bus-context';

export const useBusSubscribe = <T>(
  eventName: HttpEventClassType<T>,
  handler: HttpEventHandler<T>
): void => {
  // The event bus.
  const eventBus = useContext(EventBusContext);

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
  useCompareEffect(
    () => {
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
