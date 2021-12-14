export class HttpContextToken<ValueT> {
  constructor(public readonly defaultValue: ValueT) {}
}

export class HttpContext {
  private readonly map = new Map<HttpContextToken<unknown>, unknown>();

  set<T>(token: HttpContextToken<T>, value: T): HttpContext {
    this.map.set(token, value);
    return this;
  }

  get<T>(token: HttpContextToken<T>): T | undefined {
    if (!this.map.has(token)) {
      return token.defaultValue;
    }
    return this.map.get(token) as T;
  }

  delete(token: HttpContextToken<unknown>): HttpContext {
    this.map.delete(token);
    return this;
  }

  has(token: HttpContextToken<unknown>): boolean {
    return this.map.has(token);
  }

  keys(): IterableIterator<HttpContextToken<unknown>> {
    return this.map.keys();
  }
}
