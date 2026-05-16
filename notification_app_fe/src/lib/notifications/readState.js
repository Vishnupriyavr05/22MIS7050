import { Log } from "@campus/logging-middleware";
import { STORAGE_KEYS } from "@/lib/config";

function readLocalReadIds() {
  if (typeof window === "undefined") return new Set();

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.readIds);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw));
  } catch {
    return new Set();
  }
}

export function mergeReadState(notifications) {
  const readIds = readLocalReadIds();

  return notifications.map((n) => ({
    ...n,
    is_read: n.is_read || readIds.has(n.id),
  }));
}

export function markNotificationRead(id) {
  if (typeof window === "undefined") return;

  const readIds = readLocalReadIds();
  readIds.add(id);
  localStorage.setItem(STORAGE_KEYS.readIds, JSON.stringify([...readIds]));

  Log("frontend", "info", "state", "Notification marked as read locally", { id });
}

export function clearReadState() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(STORAGE_KEYS.readIds);
  Log("frontend", "info", "state", "Local read state cleared");
}

export function countUnread(notifications) {
  return notifications.filter((n) => !n.is_read).length;
}
