/**
 * Unit tests for utils/general.ts — apiFetch<T>
 *
 * apiFetch wraps the browser `fetch` API and normalizes every outcome
 * (network failure, malformed JSON, a `{ success: false }` API error, and
 * genuine success) into a single discriminated ApiResponse<T> shape, never
 * throwing. `global.fetch` is mocked per-test; no real network calls.
 */

import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  jest,
} from "@jest/globals";
import { apiFetch } from "@/utils/general";

const originalFetch = global.fetch;

function mockFetchResolvedOnce(init: {
  ok: boolean;
  status?: number;
  statusText?: string;
  text: string;
}) {
  // `jest.fn()` with no generic infers a `never`-args mock under strict TS
  // (@jest/globals), so we type it explicitly against `typeof fetch` rather
  // than reaching for a broad `as any` on the mock itself.
  const mockedFetch = jest.fn<typeof fetch>().mockResolvedValue({
    ok: init.ok,
    status: init.status ?? (init.ok ? 200 : 500),
    statusText: init.statusText ?? "",
    text: () => Promise.resolve(init.text),
  } as unknown as Response);
  global.fetch = mockedFetch;
}

afterEach(() => {
  global.fetch = originalFetch;
  jest.restoreAllMocks();
});

describe("apiFetch", () => {
  it("returns success:true with the unwrapped data on a successful response", async () => {
    mockFetchResolvedOnce({
      ok: true,
      status: 200,
      text: JSON.stringify({
        success: true,
        data: { id: "1", name: "Widget" },
      }),
    });

    const result = await apiFetch<{ id: string; name: string }>(
      "/api/products/1",
    );

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ id: "1", name: "Widget" });
    }
  });

  it("returns success:false with a network-error message when fetch rejects", async () => {
    global.fetch = jest
      .fn<typeof fetch>()
      .mockRejectedValue(new Error("network down"));

    const result = await apiFetch("/api/products");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.data).toBeNull();
      expect(result.error).toBe(
        "Network error. Please check your internet connection.",
      );
    }
  });

  it("returns success:false when the response body is not valid JSON", async () => {
    mockFetchResolvedOnce({
      ok: true,
      status: 200,
      statusText: "OK",
      text: "<html>not json</html>",
    });

    const result = await apiFetch("/api/products");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Invalid JSON");
    }
  });

  it("returns success:false using the API's own error message when the server reports failure", async () => {
    mockFetchResolvedOnce({
      ok: false,
      status: 404,
      statusText: "Not Found",
      text: JSON.stringify({ success: false, error: "Product not found" }),
    });

    const result = await apiFetch("/api/products/does-not-exist");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Product not found");
    }
  });

  it("falls back to a generic status-based message when the server omits an error string", async () => {
    mockFetchResolvedOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      text: JSON.stringify({}),
    });

    const result = await apiFetch("/api/products");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Request failed with status 500");
    }
  });

  it("treats json.success === false as a failure even when res.ok is true", async () => {
    // Defensive case: HTTP 200 but the API body still signals failure.
    mockFetchResolvedOnce({
      ok: true,
      status: 200,
      text: JSON.stringify({
        success: false,
        error: "Business rule violation",
      }),
    });

    const result = await apiFetch("/api/orders");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Business rule violation");
    }
  });

  it("handles an empty response body (e.g. 204 No Content) without throwing", async () => {
    mockFetchResolvedOnce({ ok: true, status: 204, text: "" });

    const result = await apiFetch("/api/cart/item-1");

    // res.ok is true and json.success is undefined (not === false), so
    // apiFetch resolves as success with undefined data rather than crashing.
    expect(result.success).toBe(true);
  });

  it("merges custom headers with the default Content-Type", async () => {
    mockFetchResolvedOnce({
      ok: true,
      status: 200,
      text: JSON.stringify({ success: true, data: null }),
    });

    await apiFetch("/api/products", {
      headers: { Authorization: "Bearer token" },
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/products",
      expect.objectContaining({
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          Authorization: "Bearer token",
        }),
      }),
    );
  });
});
