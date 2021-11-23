import { HttpCacheEntry } from './types';

export abstract class HttpCacheStore<Identifier = string> {
  /**
   * Gets the cached entry for the given identifier.
   */
  abstract get<T>(identifier: Identifier): HttpCacheEntry<T> | undefined;

  /**
   * Stores the entry.
   */
  abstract put<T>(entry: HttpCacheEntry<T>): () => void;

  /**
   * Determines if the entry is in the store.
   */
  abstract has(idenitifier: Identifier): boolean;

  /**
   * Deletes the cached entry for the given identifier.
   */
  abstract delete(idenitifier: Identifier): void;

  /**
   * Gets all stored entries.
   */
  abstract entries(): HttpCacheEntry<unknown>[];

  /**
   * Flushes the store by deleting all entries.
   */
  abstract flush(): void;
}
