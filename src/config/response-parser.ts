export function httpResponseParser<HttpResponse>(res: Response): Promise<HttpResponse> {
  return res.json();
}
