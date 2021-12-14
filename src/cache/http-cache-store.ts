import { HttpCacheEntry } from './types';

export interface HttpCacheStore {
  /**
   * Gets the cached entry for the given identifier.
   */
  get<HttpResponseT>(identifier: string): HttpCacheEntry<HttpResponseT> | undefined;

  /**
   * Stores the entry.
   */
  put<HttpResponseT>(identifier: string, entry: HttpCacheEntry<HttpResponseT>): () => void;

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
