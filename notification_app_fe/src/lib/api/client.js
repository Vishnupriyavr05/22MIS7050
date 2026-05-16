import axios from "axios";
import { Log } from "@campus/logging-middleware";
import { API_BASE_URL, STORAGE_KEYS } from "@/lib/config";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

function readToken() {
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_BEARER_TOKEN ?? null;
  }

  return (
    localStorage.getItem(STORAGE_KEYS.bearerToken) ??
    process.env.NEXT_PUBLIC_BEARER_TOKEN ??
    null
  );
}

apiClient.interceptors.request.use((config) => {
  const token = readToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  Log("frontend", "debug", "api", "Outgoing API request", {
    method: config.method,
    url: config.url,
    params: config.params,
  });

  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    Log("frontend", "info", "api", "API request succeeded", {
      url: response.config.url,
      status: response.status,
    });
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const level =
      status === 401 || status === 403 ? "warn" : status && status >= 500 ? "error" : "warn";

    Log("frontend", level, "api", "API request failed", {
      url: error.config?.url,
      status,
      message: error.response?.data?.message ?? error.message,
    });
    return Promise.reject(error);
  }
);
