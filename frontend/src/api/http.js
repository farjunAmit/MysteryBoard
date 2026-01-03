import { getToken } from "../auth/authStorage.js";

export async function http(path, options = {}) {
  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const message =
      (isJson && payload && payload.message) ? payload.message : `Request failed (${res.status})`;
    throw new Error(message);
  }

  return payload;
}

export async function httpAuth(path, options = {}) {
  const token = getToken();
  
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(path, {
    ...options,
    headers,
  });

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const message =
      (isJson && payload && payload.message) ? payload.message : `Request failed (${res.status})`;
    throw new Error(message);
  }

  return payload;
}