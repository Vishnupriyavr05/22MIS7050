"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Log } from "@campus/logging-middleware";
import {
  fetchAllNotificationsForRanking,
  getTopNotifications,
} from "@/lib/api/notifications";

export function useTopNotifications(limit, typeFilter) {
  const query = useQuery({
    queryKey: ["top-notifications-pool"],
    queryFn: () => fetchAllNotificationsForRanking(),
    staleTime: 0,
  });

  const top = useMemo(() => {
    if (!query.data) return [];

    Log("frontend", "debug", "hook", "Deriving top notifications in hook", {
      limit,
      typeFilter,
    });

    return getTopNotifications(query.data, limit, {
      unreadOnly: true,
      typeFilter: typeFilter === "All" ? undefined : typeFilter,
    });
  }, [query.data, limit, typeFilter]);

  return { ...query, top, pool: query.data ?? [] };
}
