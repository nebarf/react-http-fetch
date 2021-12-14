export class HttpContextToken<ValueT> {
  constructor(public readonly defaultValue: ValueT) {}
}

export class HttpContext {
  private readonly map = new Map<HttpContextToken<unknown>, unknown>();

  /**
   * Store a value in the context. If a value is already present it will be overwritten.
   */
  set<T>(token: HttpContextToken<T>, value: T): HttpContext {
    this.map.set(token, value);
    return this;
  }

  /**
   * Retrieve the value associated with the given token.
   */
  get<T>(token: HttpContextToken<T>): T | undefined {
    if (!this.map.has(token)) {
      this.map.set(token, token.defaultValue);
    }
    return this.map.get(token) as T;
  }

  /**
   * Delete the value associated with the given token.
   */
  delete(token: HttpContextToken<unknown>): HttpContext {
    this.map.delete(token);
    return this;
  }

  /**
   * Checks for existence of a given token.
   */
  has(token: HttpContextToken<unknown>): boolean {
    return this.map.has(token);
  }

  /**
   * @returns a list of tokens currently stored in the context.
   */
  keys(): IterableIterator<HttpContextToken<unknown>> {
    return this.map.keys();
  }
}
