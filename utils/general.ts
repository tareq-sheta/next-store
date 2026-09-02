export type ApiResponse<T> =
  | { success: true; data: T; error?: never /* status: number */ }
  | { success: false; data: null; error: string /* status: number  */ };

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<ApiResponse<T>> {
  let res: Response;

  try {
    res = await fetch(endpoint, {
      ...options, // Spread options first
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });
    // console.log("response in apiFetch", res);
  } catch (err) {
    return {
      success: false,
      data: null,
      error: "Network error. Please check your internet connection.",
      // status: 0,
    };
  }

  let json: any;
  try {
    // Prevent JSON parse errors on empty responses (like 204 No Content)
    const text = await res.text();
    // console.log("text in apiFetch", text);
    json = text ? JSON.parse(text) : {};
    // console.log("json in apiFetch", json);
  } catch (err) {
    return {
      success: false,
      data: null,
      error: `Server Error (${res.status} ${res.statusText}): Invalid JSON`,
      // status: res.status,
    };
  }

  // Assumes your backend strictly returns { success: boolean, data: T, error?: string }
  if (!res.ok || json.success === false) {
    return {
      success: false,
      data: null,
      error: json.error ?? `Request failed with status ${res.status}`,
      // status: res.status,
    };
  }

  return {
    success: true,
    data: json.data as T, // Or just 'json as T' if your backend doesn't wrap data
    // status: res.status,
  };
}
