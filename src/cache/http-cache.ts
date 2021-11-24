import { HttpRequest } from '../client';
import { HttpCacheEntry } from './types';
import { HttpCacheStorePrefixDecorator } from './prefix-decorator';

export class HttpCacheService {
  private prefixedStore: HttpCacheStorePrefixDecorator;

  constructor(store: HttpCacheStorePrefixDecorator) {
    this.prefixedStore = store;
  }

  /**
   * Gets the unique key used as idenitifier to store
   * a cached response for the given http request.
   */
  private getRequestIdentifier(request: HttpRequest): string {
    const fullUrl = request.urlWithParams;
    return fullUrl;
  }

  /**
   * Tells if a cached entry is expired.
   */
  private isEntryExpired<T>(entry: HttpCacheEntry<T>): boolean {
    const nowTime = new Date().getTime();
    const cachedAtDate = entry.cachedAt instanceof Date ? entry.cachedAt : new Date(entry.cachedAt);
    const cachedTime = cachedAtDate.getTime();
    return cachedTime + entry.maxAge < nowTime;
  }

  /**
   * Gets the cached entry associated with the request.
   */
  private getEntry<T>(request: HttpRequest): HttpCacheEntry<T> | undefined {
    const reqIdentifier = this.getRequestIdentifier(request);
    return this.prefixedStore.get(reqIdentifier) as HttpCacheEntry<T>;
  }

  /**
   * Removes a cached entry.
   */
  private removeEntry<T>(entry: HttpCacheEntry<T>): void {
    this.prefixedStore.delete(entry.identifier);
  }

  /**
   * Determines if for the given request is available a cached response.
   */
  has(request: HttpRequest): boolean {
    const key = this.getRequestIdentifier(request);
    return this.prefixedStore.has(key);
  }

  /**
   * Tells if the cached request is expired or not.
   */
  isExpired(request: HttpRequest): boolean {
    const cachedEntry = this.getEntry(request);
    if (!cachedEntry) {
      return true;
    }

    return this.isEntryExpired(cachedEntry);
  }

  /**
   * Gets the cached entry in the map for the given request.
   */
  get<T>(request: HttpRequest): T | undefined {
    const cachedEntry = this.getEntry(request);
    if (!cachedEntry) {
      return undefined;
    }

    const isExpired = this.isEntryExpired(cachedEntry);
    return isExpired ? undefined : (cachedEntry.response as T);
  }

  /**
   * Puts a new cached response for the given request.
   */
  put<T>(request: HttpRequest, response: T): void {
    if (!request.maxAge) {
      return;
    }

    const reqKey = this.getRequestIdentifier(request);
    const entry: HttpCacheEntry<T> = {
      response,
      identifier: reqKey,
      cachedAt: new Date(),
      maxAge: request.maxAge,
    };

    // Update the store.
    this.prefixedStore.put(entry.identifier, entry);

    // Remove the entry from the cache once expired.
    const timerRef = setTimeout(() => {
      this.removeEntry(entry);
      clearTimeout(timerRef);
    }, request.maxAge);
  }

  /**
   * Founds all expired entry and deletes them from the cache.
   */
  prune(): void {
    const entries = this.prefixedStore.entries();
    entries.forEach((entry) => {
      const isEntryExpired = this.isEntryExpired(entry);

      if (isEntryExpired) {
        this.removeEntry(entry);
      }
    });
  }

  /**
   * Flush the cache by removing all entries.
   */
  flush(): void {
    this.prefixedStore.flush();
  }
}
