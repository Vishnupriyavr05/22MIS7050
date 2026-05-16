"use client";

import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Alert,
  Box,
  Button,
  FormControl,
  MenuItem,
  Select,
  Skeleton,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { matchesSearch, useSearch } from "@/context/SearchContext";
import { Log } from "@campus/logging-middleware";
import { NotificationListItem } from "@/components/notifications/NotificationListItem";
import { useTopNotifications } from "@/hooks/useTopNotifications";
import { clearReadState } from "@/lib/notifications/readState";

const LIMIT_OPTIONS = [10, 15, 20];

export default function PriorityInboxPage() {
  const queryClient = useQueryClient();
  const [limit, setLimit] = useState(10);
  const [filter, setFilter] = useState("All");
  const { search } = useSearch();

  useEffect(() => {
    Log("frontend", "info", "page", "Priority inbox page loaded");
  }, []);

  const { top, isLoading, isError, refetch, pool } = useTopNotifications(limit, filter);

  const filteredTop = useMemo(
    () => top.filter((n) => matchesSearch(search, n)),
    [top, search]
  );

  const poolUnread = pool?.filter((n) => !n.is_read).length ?? 0;

  const handleResetRead = () => {
    clearReadState();
    Log("frontend", "info", "page", "User reset read state from priority inbox");
    void queryClient.invalidateQueries({ queryKey: ["top-notifications-pool"] });
    void queryClient.invalidateQueries({ queryKey: ["notifications"] });
    void refetch();
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Priority Inbox
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
          alignItems: "flex-end",
        }}
      >
        <Box>
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            sx={{ mb: 0.75, lineHeight: 1.2, minHeight: 14 }}
          >
            Show top
          </Typography>
          <ToggleButtonGroup
            exclusive
            size="small"
            value={limit}
            onChange={(_, value) => {
              if (value) {
                Log("frontend", "info", "state", "Priority inbox limit changed", { limit: value });
                setLimit(value);
              }
            }}
            sx={{
              height: 40,
              "& .MuiToggleButton-root": {
                height: 40,
                px: 2,
                textTransform: "none",
              },
            }}
          >
            {LIMIT_OPTIONS.map((n) => (
              <ToggleButton key={n} value={n}>
                Top {n}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        <Box>
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            sx={{ mb: 0.75, lineHeight: 1.2, minHeight: 14 }}
          >
            Category
          </Typography>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <Select
              value={filter}
              onChange={(e) => {
                const value = e.target.value;
                Log("frontend", "info", "component", "Priority inbox filter changed", {
                  filter: value,
                });
                setFilter(value);
              }}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Placement">Placement</MenuItem>
              <MenuItem value="Result">Result</MenuItem>
              <MenuItem value="Event">Event</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {isError && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Live API unavailable — displaying ranked mock notifications.
        </Alert>
      )}

      {isLoading ? (
        Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} variant="rounded" height={96} sx={{ mb: 1.5 }} />
        ))
      ) : filteredTop.length === 0 ? (
        <Box>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            No unread notifications in this view.
            {poolUnread === 0 && pool && pool.length > 0
              ? " You may have marked them as read while browsing other pages."
              : ""}
          </Typography>
          <Button variant="outlined" onClick={handleResetRead}>
            Reset read status
          </Button>
        </Box>
      ) : (
        filteredTop.map((n) => (
          <NotificationListItem
            key={n.id}
            notification={n}
            onRead={() => {
              void queryClient.invalidateQueries({ queryKey: ["top-notifications-pool"] });
              void refetch();
            }}
          />
        ))
      )}
    </Box>
  );
}
