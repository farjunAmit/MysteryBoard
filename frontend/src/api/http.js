// src/api/http.js
import { getToken } from "../auth/authStorage.js";
import { API_BASE_URL } from "./config";

function buildUrl(path) {
  return `${API_BASE_URL}${path}`;
}

async function handleResponse(res) {
  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const message =
      isJson && payload && payload.message
        ? payload.message
        : `Request failed (${res.status})`;
    throw new Error(message);
  }

  return payload;
}

export async function http(path, options = {}) {
  const res = await fetch(buildUrl(path), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  return handleResponse(res);
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

  const res = await fetch(buildUrl(path), {
    ...options,
    headers,
  });

  return handleResponse(res);
}
