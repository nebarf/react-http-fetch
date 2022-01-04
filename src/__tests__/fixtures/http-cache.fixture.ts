import { HttpCacheService, HttpInMemoryCacheStore } from '../../cache';
import { HttpCacheStorePrefixDecorator } from '../../cache/prefix-decorator';

export class HttpCacheFixture {
  static defaultStore: HttpCacheStorePrefixDecorator = new HttpCacheStorePrefixDecorator(
    new HttpInMemoryCacheStore()
  );

  static create(store?: HttpCacheStorePrefixDecorator): HttpCacheService {
    const fallenbackStore =
      store || new HttpCacheStorePrefixDecorator(new HttpInMemoryCacheStore());
    return new HttpCacheService(fallenbackStore);
  }
}
