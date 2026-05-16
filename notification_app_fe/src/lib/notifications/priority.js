import { Log } from "@campus/logging-middleware";

const PRIORITY_SCORE = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

export function getPriorityScore(type) {
  return PRIORITY_SCORE[type] ?? 0;
}

export function compareNotifications(a, b) {
  const scoreDiff = getPriorityScore(b.notification_type) - getPriorityScore(a.notification_type);
  if (scoreDiff !== 0) {
    return scoreDiff;
  }

  return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
}

export function sortNotificationsByPriority(notifications) {
  return [...notifications].sort(compareNotifications);
}

export function getTopNotifications(notifications, limit, options = {}) {
  Log("frontend", "info", "utils", "Computing top notifications", {
    limit,
    total: notifications.length,
    unreadOnly: options.unreadOnly !== false,
    typeFilter: options.typeFilter,
  });

  let pool = notifications;

  if (options.unreadOnly !== false) {
    pool = pool.filter((n) => !n.is_read);
  }

  if (options.typeFilter) {
    pool = pool.filter((n) => n.notification_type === options.typeFilter);
  }

  const sorted = sortNotificationsByPriority(pool);
  const top = sorted.slice(0, limit);

  Log("frontend", "debug", "utils", "Top notifications computed", {
    returned: top.length,
  });

  return top;
}
