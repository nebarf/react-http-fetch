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
   * Keeps track of the time the entry was cached.
   */
  lastRead: number;

  /**
   * The max age of entry expressed in ms.
   */
  maxAge: number;
}
