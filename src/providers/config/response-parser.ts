export function jsonHttpResponseParser<HttpResponse>(res: Response): Promise<HttpResponse> {
  return res.json();
}
