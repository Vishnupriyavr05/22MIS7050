export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://4.224.186.213/evaluation-service";

export const STORAGE_KEYS = {
  clientId: "campus_client_id",
  clientSecret: "campus_client_secret",
  bearerToken: "campus_bearer_token",
  readIds: "campus_read_notification_ids",
};
