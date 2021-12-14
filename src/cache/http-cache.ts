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
  private getRequestIdentifier<HttpRequestBodyT>(request: HttpRequest<HttpRequestBodyT>): string {
    const fullUrl = request.urlWithParams;
    return fullUrl;
  }

  /**
   * Tells if a cached entry is expired.
   */
  private isEntryExpired<HttpResponseT>(entry: HttpCacheEntry<HttpResponseT>): boolean {
    const nowTime = new Date().getTime();
    const cachedAtDate = entry.cachedAt instanceof Date ? entry.cachedAt : new Date(entry.cachedAt);
    const cachedTime = cachedAtDate.getTime();
    return cachedTime + entry.maxAge < nowTime;
  }

  /**
   * Gets the cached entry associated with the request.
   */
  private getEntry<HttpResponseT, HttpRequestBodyT>(
    request: HttpRequest<HttpRequestBodyT>
  ): HttpCacheEntry<HttpResponseT> | undefined {
    const reqIdentifier = this.getRequestIdentifier(request);
    return this.prefixedStore.get(reqIdentifier) as HttpCacheEntry<HttpResponseT>;
  }

  /**
   * Removes a cached entry.
   */
  private removeEntry<HttpResponseT>(entry: HttpCacheEntry<HttpResponseT>): void {
    this.prefixedStore.delete(entry.identifier);
  }

  /**
   * Determines if for the given request is available a cached response.
   */
  has<HttpRequestBodyT>(request: HttpRequest<HttpRequestBodyT>): boolean {
    const key = this.getRequestIdentifier(request);
    return this.prefixedStore.has(key);
  }

  /**
   * Tells if the cached request is expired or not.
   */
  isExpired<HttpRequestBodyT>(request: HttpRequest<HttpRequestBodyT>): boolean {
    const cachedEntry = this.getEntry(request);
    if (!cachedEntry) {
      return true;
    }

    return this.isEntryExpired(cachedEntry);
  }

  /**
   * Gets the cached entry in the map for the given request.
   */
  get<HttpResponseT, HttpRequestBodyT>(
    request: HttpRequest<HttpRequestBodyT>
  ): HttpResponseT | undefined {
    const cachedEntry = this.getEntry(request);
    if (!cachedEntry) {
      return undefined;
    }

    const isExpired = this.isEntryExpired(cachedEntry);
    return isExpired ? undefined : (cachedEntry.response as HttpResponseT);
  }

  /**
   * Puts a new cached response for the given request.
   */
  put<HttpResponseT, HttpRequestBodyT>(
    request: HttpRequest<HttpRequestBodyT>,
    response: HttpResponseT
  ): void {
    if (!request.maxAge) {
      return;
    }

    const reqKey = this.getRequestIdentifier(request);
    const entry: HttpCacheEntry<HttpResponseT> = {
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
