import { HttpCacheStore } from './http-cache-store';
import { HttpCacheEntry } from './types';

export class HttpCacheStorePrefixDecorator implements HttpCacheStore {
  /**
   * The label use to prefix any entry identifier.
   */
  private prefix = 'rhf';

  /**
   * The label used to separate the prefix and the entry identifier.
   */
  private separator = '__';

  /**
   * The http cache store to decorate.
   */
  private store: HttpCacheStore;

  constructor(store: HttpCacheStore, prefix?: string, separator?: string) {
    this.store = store;
    this.prefix = prefix || this.prefix;
    this.separator = separator || this.separator;
  }

  /**
   * Computes the entry identifier by concatenating the store prefix with
   * the base identifier.
   */
  private getPrefixedIdentifier(entryIdentifier: string): string {
    return `${this.prefix}${this.separator}${entryIdentifier}`;
  }

  /**
   * @inheritdoc
   */
  get<HttpResponseT>(entryIdentifier: string): HttpCacheEntry<HttpResponseT> | undefined {
    const prefixedIdentifier = this.getPrefixedIdentifier(entryIdentifier);
    return this.store.get(prefixedIdentifier);
  }

  /**
   * @inheritdoc
   */
  put<HttpResponseT>(entryIdentifier: string, entry: HttpCacheEntry<HttpResponseT>): () => void {
    const prefixedIdentifier = this.getPrefixedIdentifier(entryIdentifier);
    return this.store.put(prefixedIdentifier, entry);
  }

  /**
   * @inheritdoc
   */
  has(entryIdentifier: string): boolean {
    const prefixedIdentifier = this.getPrefixedIdentifier(entryIdentifier);
    return this.store.has(prefixedIdentifier);
  }

  /**
   * @inheritdoc
   */
  delete(entryIdentifier: string): void {
    const prefixedIdentifier = this.getPrefixedIdentifier(entryIdentifier);
    return this.store.delete(prefixedIdentifier);
  }

  /**
   * @inheritdoc
   */
  entries(): HttpCacheEntry<unknown>[] {
    return this.store.entries();
  }

  /**
   * @inheritdoc
   */
  flush(): void {
    return this.store.flush();
  }
}
