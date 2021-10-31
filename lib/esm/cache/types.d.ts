export interface HttpCacheEntry<T> {
    /**
     * The identifier for the cached entry.
     */
    identifier: string;
    /**
     * The cached parsed reponse for the remote call.
     */
    response: T;
    /**
     * Keeps track of the Date the entry was cached.
     */
    cachedAt: Date;
    /**
     * The max age of entry expressed in ms.
     */
    maxAge: number;
}
