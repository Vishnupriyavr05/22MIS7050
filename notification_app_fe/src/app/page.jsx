"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Box, Button, Grid2 as Grid, Skeleton, Typography } from "@mui/material";
import { Log } from "@campus/logging-middleware";
import { StatCards } from "@/components/dashboard/StatCards";
import { SummaryChart } from "@/components/dashboard/SummaryChart";
import { QuickFilters } from "@/components/dashboard/QuickFilters";
import { NotificationListItem } from "@/components/notifications/NotificationListItem";
import { matchesSearch, useSearch } from "@/context/SearchContext";
import { useNotificationPool } from "@/hooks/useNotificationPool";
import { useTopNotifications } from "@/hooks/useTopNotifications";
import { useNotifications } from "@/hooks/useNotifications";

export default function OverviewPage() {
  const [filter, setFilter] = useState("All");
  const { search } = useSearch();
  const { unreadCount } = useNotificationPool();

  useEffect(() => {
    Log("frontend", "info", "page", "Overview page loaded");
  }, []);

  const { top, isLoading: topLoading, refetch: refetchTop } = useTopNotifications(5, filter);
  const { data: recentData, isLoading: recentLoading, refetch } = useNotifications(1, 6, filter);

  const filteredTop = useMemo(
    () => top.filter((n) => matchesSearch(search, n)),
    [top, search]
  );

  const filteredRecent = useMemo(
    () => (recentData?.items ?? []).filter((n) => matchesSearch(search, n)),
    [recentData?.items, search]
  );

  const stats = useMemo(
    () => ({
      total: recentData?.total ?? 0,
      unread: unreadCount,
      priority: top.length,
    }),
    [recentData?.total, unreadCount, top.length]
  );

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Campus Notifications
      </Typography>

      <StatCards total={stats.total} unread={stats.unread} priority={stats.priority} />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Typography variant="h6">Priority Inbox</Typography>
              <Button component={Link} href="/priority-inbox" size="small">
                View all
              </Button>
            </Box>
            {topLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} variant="rounded" height={88} sx={{ mb: 1.5 }} />
                ))
              : filteredTop.map((n) => (
                  <NotificationListItem
                    key={n.id}
                    notification={n}
                    compact
                    onRead={() => refetchTop()}
                  />
                ))}
          </Box>

          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Typography variant="h6">Recent Notifications</Typography>
              <Button component={Link} href="/notifications" size="small">
                View all
              </Button>
            </Box>
            {recentLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} variant="rounded" height={72} sx={{ mb: 1.5 }} />
                ))
              : filteredRecent.map((n) => (
                  <NotificationListItem
                    key={n.id}
                    notification={n}
                    compact
                    onRead={() => refetch()}
                  />
                ))}
          </Box>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Box sx={{ mb: 2 }}>
            <SummaryChart />
          </Box>
          <QuickFilters active={filter} onChange={setFilter} />
        </Grid>
      </Grid>
    </Box>
  );
}
