import { Log } from "@campus/logging-middleware";
import { apiClient } from "./client";
import { MOCK_NOTIFICATIONS } from "@/lib/notifications/mockData";
import { mergeReadState } from "@/lib/notifications/readState";

function normalizeNotification(raw) {
  const type = String(
    raw.notification_type ?? raw.type ?? raw.notificationType ?? "Event"
  );

  return {
    id: String(raw.id ?? raw._id ?? raw.notification_id ?? crypto.randomUUID()),
    notification_type: ["Placement", "Result", "Event"].includes(type) ? type : "Event",
    message: String(raw.message ?? raw.body ?? raw.content ?? ""),
    title: raw.title ? String(raw.title) : undefined,
    created_at: String(
      raw.created_at ?? raw.createdAt ?? raw.timestamp ?? new Date().toISOString()
    ),
    is_read: Boolean(raw.is_read ?? raw.isRead ?? raw.read ?? false),
  };
}

function extractList(payload) {
  const list = payload.notifications ?? payload.data ?? payload.items ?? [];
  return list.map(normalizeNotification);
}

export async function fetchNotifications(params) {
  Log("frontend", "info", "api", "Fetching notifications", { ...params });

  try {
    const { data } = await apiClient.get("/notifications", {
      params: {
        page: params.page,
        limit: params.limit,
        ...(params.notification_type
          ? { notification_type: params.notification_type }
          : {}),
      },
    });

    const items = mergeReadState(extractList(data));
    const total = data.total ?? data.totalCount ?? items.length + (params.page - 1) * params.limit;

    Log("frontend", "info", "api", "Fetched notifications successfully", {
      count: items.length,
      total,
    });

    return { items, total };
  } catch (error) {
    Log("frontend", "warn", "api", "Falling back to mock notifications", {
      reason: error instanceof Error ? error.message : "unknown",
    });

    let items = [...MOCK_NOTIFICATIONS];

    if (params.notification_type) {
      items = items.filter((n) => n.notification_type === params.notification_type);
    }

    const start = (params.page - 1) * params.limit;
    const paged = mergeReadState(items.slice(start, start + params.limit));

    return { items: paged, total: items.length };
  }
}

export async function fetchAllNotificationsForRanking(maxPages = 5, pageSize = 50) {
  Log("frontend", "info", "api", "Fetching notification pool for ranking");

  const aggregated = [];
  const seen = new Set();

  const addUnique = (items) => {
    for (const item of items) {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        aggregated.push(item);
      }
    }
  };

  try {
    for (let page = 1; page <= maxPages; page += 1) {
      const { data } = await apiClient.get("/notifications", {
        params: { page, limit: pageSize },
      });

      const items = mergeReadState(extractList(data));
      addUnique(items);

      const total = data.total ?? data.totalCount ?? items.length;
      if (aggregated.length >= total || items.length === 0) {
        break;
      }
    }
  } catch (error) {
    Log("frontend", "warn", "api", "Ranking pool API fetch failed, using mock data", {
      reason: error instanceof Error ? error.message : "unknown",
    });
  }

  if (aggregated.length === 0) {
    addUnique(mergeReadState([...MOCK_NOTIFICATIONS]));
    Log("frontend", "info", "api", "Ranking pool loaded from mock data", {
      count: aggregated.length,
    });
  }

  Log("frontend", "info", "api", "Notification pool ready", {
    count: aggregated.length,
    unread: aggregated.filter((n) => !n.is_read).length,
  });

  return aggregated;
}

export { getTopNotifications } from "@/lib/notifications/priority";
