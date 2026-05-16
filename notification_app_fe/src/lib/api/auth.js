import { Log } from "@campus/logging-middleware";
import { apiClient } from "./client";
import { STORAGE_KEYS } from "@/lib/config";

function persistCredentials(clientId, clientSecret, token) {
  if (typeof window === "undefined") return;

  localStorage.setItem(STORAGE_KEYS.clientId, clientId);
  localStorage.setItem(STORAGE_KEYS.clientSecret, clientSecret);
  if (token) {
    localStorage.setItem(STORAGE_KEYS.bearerToken, token);
  }

  Log("frontend", "info", "auth", "Credentials stored in local storage");
}

export async function registerUser(payload) {
  Log("frontend", "info", "auth", "Registering evaluation service user", {
    email: payload.email,
    rollNo: payload.rollNo,
  });

  const { data } = await apiClient.post("/register", payload);

  const clientId = data.clientID ?? data.clientId;
  const token = data.access_token ?? data.token;

  if (clientId && data.clientSecret) {
    persistCredentials(clientId, data.clientSecret, token);
  } else if (token) {
    localStorage.setItem(STORAGE_KEYS.bearerToken, token);
  }

  Log("frontend", "info", "auth", "Registration completed", {
    hasClientId: Boolean(clientId),
    hasToken: Boolean(token),
  });

  return data;
}

export async function generateBearerToken(clientId, clientSecret) {
  const id =
    clientId ??
    (typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEYS.clientId) : null) ??
    process.env.NEXT_PUBLIC_CLIENT_ID;

  const secret =
    clientSecret ??
    (typeof window !== "undefined"
      ? localStorage.getItem(STORAGE_KEYS.clientSecret)
      : null) ??
    process.env.NEXT_PUBLIC_CLIENT_SECRET;

  if (!id || !secret) {
    Log("frontend", "error", "auth", "Missing client credentials for token generation");
    throw new Error(
      "Client ID and Client Secret are required. Register first or set environment variables."
    );
  }

  Log("frontend", "info", "auth", "Generating bearer token");

  const { data } = await apiClient.post("/auth", {
    clientID: id,
    clientSecret: secret,
  });

  const token = data.access_token ?? data.token ?? data.bearerToken;

  if (!token) {
    Log("frontend", "error", "auth", "Token missing in auth response", { data });
    throw new Error("Bearer token was not returned by the authentication API.");
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.bearerToken, token);
  }

  Log("frontend", "info", "auth", "Bearer token generated successfully");
  return token;
}

export function getStoredBearerToken() {
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_BEARER_TOKEN ?? null;
  }
  return (
    localStorage.getItem(STORAGE_KEYS.bearerToken) ??
    process.env.NEXT_PUBLIC_BEARER_TOKEN ??
    null
  );
}

export function clearAuthStorage() {
  if (typeof window === "undefined") return;
  Object.values(STORAGE_KEYS).forEach((key) => {
    if (key !== STORAGE_KEYS.readIds) {
      localStorage.removeItem(key);
    }
  });
  Log("frontend", "warn", "auth", "Authentication storage cleared");
}
