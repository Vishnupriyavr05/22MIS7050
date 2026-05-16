"use client";

import { useQuery } from "@tanstack/react-query";
import { Log } from "@campus/logging-middleware";
import { fetchNotifications } from "@/lib/api/notifications";

export function useNotifications(page, limit, filter) {
  const type = filter === "All" ? undefined : filter;

  return useQuery({
    queryKey: ["notifications", page, limit, filter],
    queryFn: async () => {
      Log("frontend", "info", "hook", "useNotifications query executing", {
        page,
        limit,
        filter,
      });
      return fetchNotifications({ page, limit, notification_type: type });
    },
  });
}
