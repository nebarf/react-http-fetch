import { HttpCacheEntry } from './types';
import { HttpCacheStore } from './http-cache-store';

export class HttpInMemoryCacheStore implements HttpCacheStore {
  /**
   * The local cache providing for a request identifier
   * the corresponding cached entry.
   */
  private readonly store = new Map<string, HttpCacheEntry<unknown>>();

  /**
   * @inheritdoc
   */
  get<HttpResponseT>(identifier: string): HttpCacheEntry<HttpResponseT> | undefined {
    return this.store.get(identifier) as HttpCacheEntry<HttpResponseT>;
  }

  /**
   * @inheritdoc
   */
  put<HttpResponseT>(identifier: string, entry: HttpCacheEntry<HttpResponseT>): () => void {
    this.store.set(identifier, entry);
    return () => this.delete(identifier);
  }

  /**
   * @inheritdoc
   */
  has(identifier: string): boolean {
    return this.store.has(identifier);
  }

  /**
   * @inheritdoc
   */
  delete(identifier: string): void {
    this.store.delete(identifier);
  }

  /**
   * Gets all stored entries.
   */
  entries(): HttpCacheEntry<unknown>[] {
    return Array.from(this.store.values());
  }

  /**
   * @inheritdoc
   */
  flush(): void {
    this.store.clear();
  }
}
