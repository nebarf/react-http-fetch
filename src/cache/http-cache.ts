import { HttpRequest } from '@/client';

export abstract class HttpCache {
  /**
   * Gets the cached parsed response for the given request.
   */
  abstract get<T>(request: HttpRequest): T | undefined;

  /**
   * Caches the parsed response for the given request.
   */
  abstract put<T>(request: HttpRequest, response: T): void;
}
