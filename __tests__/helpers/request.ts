/**
 * Helpers for constructing `Request` objects used to invoke
 * Next.js App Router route handlers directly.
 */

const BASE_URL = "http://localhost:3000";

/**
 * Creates a standard `Request` for testing GET endpoints.
 * @param path  e.g. "/api/orders" or "/api/orders?userId=abc"
 */
export function createGETRequest(path: string): Request {
  return new Request(`${BASE_URL}${path}`, { method: "GET" });
}

/**
 * Creates a standard `Request` for testing POST/PATCH/PUT/DELETE endpoints.
 * @param method  HTTP method
 * @param path    e.g. "/api/orders"
 * @param body    JSON-serializable body (optional)
 */
export function createRequest(
  method: string,
  path: string,
  body?: unknown,
): Request {
  const init: RequestInit = { method };
  if (body !== undefined) {
    init.headers = { "Content-Type": "application/json" };
    init.body = JSON.stringify(body);
  }
  return new Request(`${BASE_URL}${path}`, init);
}

/**
 * Helper to extract the JSON body and status from a NextResponse.
 */
export async function parseResponse(res: Response) {
  const json = await res.json();
  return { status: res.status, body: json };
}
