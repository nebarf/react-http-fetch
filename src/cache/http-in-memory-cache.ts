import { HttpRequest } from '@/client';
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
   * Determines if for the given request is available a cached response.
   */
  has(request: HttpRequest): boolean {
    const key = this.getRequestIdentifier(request);
    return this.store.has(key);
  }

  /**
   * Gets the cached entry in the map for the given request.
   */
  get<T>(request: HttpRequest): T | undefined {
    const reqKey = this.getRequestIdentifier(request);

    const cachedEntry = this.store.get(reqKey);
    if (!cachedEntry) {
      return undefined;
    }

    const isExpired = cachedEntry.lastRead + cachedEntry.maxAge < Date.now();
    return isExpired ? undefined : (cachedEntry.response as T);
  }

  /**
   * Puts a new cached response for the given request.
   */
  put<T>(request: HttpRequest, response: T): void {
    if (!request.maxAge) {
      this.flush();
      return;
    }

    const reqKey = this.getRequestIdentifier(request);
    const entry: HttpCacheEntry<T> = {
      response,
      identifier: reqKey,
      lastRead: Date.now(),
      maxAge: request.maxAge,
    };

    // Update and flush the cache.
    this.store.set(reqKey, entry);
    this.flush();
  }

  /**
   * Founds all expired entry and deletes them from the cache.
   */
  flush(): void {
    this.store.forEach((entry) => {
      const isEntryExpired = entry.lastRead + entry.maxAge < Date.now();

      if (isEntryExpired) {
        this.store.delete(entry.identifier);
      }
    });
  }
}
