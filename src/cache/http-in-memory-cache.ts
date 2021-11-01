import { HttpRequest } from '../client';
import { HttpCache } from './http-cache';
import { HttpCacheEntry } from './types';

export class HttpInMemoryCacheService extends HttpCache {
  /**
   * The local cache providing for a request identifier
   * the corresponding parsed response.
   */
  private readonly store = new Map<string, HttpCacheEntry<unknown>>();

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
    const cachedTime = entry.cachedAt.getTime();
    return cachedTime + entry.maxAge < nowTime;
  }

  /**
   * Gets the cached entry associated with the request.
   */
  private getEntry<T>(request: HttpRequest): HttpCacheEntry<T> | undefined {
    const reqIdentifier = this.getRequestIdentifier(request);
    return this.store.get(reqIdentifier) as HttpCacheEntry<T>;
  }

  /**
   * Removes a cached entry.
   */
  private removeEntry<T>(entry: HttpCacheEntry<T>): void {
    this.store.delete(entry.identifier);
  }

  /**
   * Determines if for the given request is available a cached response.
   */
  has(request: HttpRequest): boolean {
    const key = this.getRequestIdentifier(request);
    return this.store.has(key);
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

    // Update and flush the cache.
    this.store.set(reqKey, entry);

    // Remove the entry from the cache once expired.
    const timerRef = setTimeout(() => {
      this.removeEntry(entry);
      clearTimeout(timerRef);
    }, request.maxAge);
  }

  /**
   * Founds all expired entry and deletes them from the cache.
   */
  flush(): void {
    this.store.forEach((entry) => {
      const isEntryExpired = this.isEntryExpired(entry);

      if (isEntryExpired) {
        this.removeEntry(entry);
      }
    });
  }
}
