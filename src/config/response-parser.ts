export function httpResponseParser<HttpResponseT>(res: Response): Promise<HttpResponseT> {
  return res.json();
}
