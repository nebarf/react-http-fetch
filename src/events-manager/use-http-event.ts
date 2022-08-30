import fastCompare from 'react-fast-compare';
import { HttpEventClassType, HttpEventHandler } from './types';
import { useEventBus } from './event-bus-context';
import { useCompareLayoutEffect } from '../shared/use-compare-layout-effect';

export const useHttpEvent = <PayloadT>(
  eventType: HttpEventClassType<PayloadT>,
  handler: HttpEventHandler<PayloadT>
): void => {
  // The event bus.
  const eventBus = useEventBus();

  /**
   * Setup the event handler.
   */
  useCompareLayoutEffect(
    () => eventBus.subscribe(eventType, handler),
    [eventBus, eventType, handler],
    fastCompare
  );
};
