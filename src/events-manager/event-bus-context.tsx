import { createContext, useContext } from 'react';
import { EventBus } from './event-bus';

const eventBus = new EventBus();

/**
 * The EventBus context.
 */
export const EventBusContext = createContext<EventBus>(eventBus);

export const useEventBus = (): EventBus => {
  return useContext(EventBusContext);
};
