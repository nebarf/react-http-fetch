export abstract class HttpEvent<PayloadT> {
  /**
   * A payload.
   */
  abstract payload: PayloadT;
}
