import { HttpCacheEntry } from './types';

export interface HttpCacheStore {
  /**
   * Gets the cached entry for the given identifier.
   */
  get<T>(identifier: string): HttpCacheEntry<T> | undefined;

  /**
   * Stores the entry.
   */
  put<T>(identifier: string, entry: HttpCacheEntry<T>): () => void;

  /**
   * Determines if the entry is in the store.
   */
  has(identifier: string): boolean;

  /**
   * Deletes the cached entry for the given identifier.
   */
  delete(identifier: string): void;

  /**
   * Gets all stored entries.
   */
  entries(): HttpCacheEntry<unknown>[];

  /**
   * Flushes the store by deleting all entries.
   */
  flush(): void;
}
