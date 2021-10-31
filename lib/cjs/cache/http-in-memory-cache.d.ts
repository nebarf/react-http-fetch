import { HttpRequest } from '@/client';
import { HttpCache } from './http-cache';
export declare class HttpInMemoryCacheService extends HttpCache {
    /**
     * The local cache providing for a request identifier
     * the corresponding parsed response.
     */
    private readonly store;
    /**
     * Gets the unique key used as idenitifier to store
     * a cached response for the given http request.
     */
    private getRequestIdentifier;
    /**
     * Tells if a cached entry is expired.
     */
    private isEntryExpired;
    /**
     * Gets the cached entry associated with the request.
     */
    private getEntry;
    /**
     * Removes a cached entry.
     */
    private removeEntry;
    /**
     * Determines if for the given request is available a cached response.
     */
    has(request: HttpRequest): boolean;
    /**
     * Tells if the cached request is expired or not.
     */
    isExpired(request: HttpRequest): boolean;
    /**
     * Gets the cached entry in the map for the given request.
     */
    get<T>(request: HttpRequest): T | undefined;
    /**
     * Puts a new cached response for the given request.
     */
    put<T>(request: HttpRequest, response: T): void;
    /**
     * Founds all expired entry and deletes them from the cache.
     */
    flush(): void;
}
