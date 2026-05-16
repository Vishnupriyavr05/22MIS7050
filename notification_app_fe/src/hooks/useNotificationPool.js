"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchAllNotificationsForRanking } from "@/lib/api/notifications";
import { getTopNotifications } from "@/lib/notifications/priority";

export function useNotificationPool() {
  const query = useQuery({
    queryKey: ["top-notifications-pool"],
    queryFn: () => fetchAllNotificationsForRanking(),
    staleTime: 30_000,
  });

  const pool = query.data ?? [];
  const unreadCount = pool.filter((n) => !n.is_read).length;
  const recentUnread = getTopNotifications(pool, 8, { unreadOnly: true });

  return {
    ...query,
    pool,
    unreadCount,
    recentUnread,
  };
}
