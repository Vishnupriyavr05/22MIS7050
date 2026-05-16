"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Alert,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Skeleton,
  Typography,
} from "@mui/material";
import { matchesSearch, useSearch } from "@/context/SearchContext";
import { Log } from "@campus/logging-middleware";
import { NotificationListItem } from "@/components/notifications/NotificationListItem";
import { NotificationTable } from "@/components/notifications/NotificationTable";
import { useNotifications } from "@/hooks/useNotifications";

const PAGE_SIZE = 10;
const VALID_TYPES = ["Placement", "Result", "Event"];

function filterFromSearchParams(searchParams) {
  const type = searchParams.get("type");
  if (type && VALID_TYPES.includes(type)) {
    return type;
  }
  return "All";
}

export function NotificationsPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { search } = useSearch();
  const filter = filterFromSearchParams(searchParams);
  const typeParam = searchParams.get("type");

  const [page, setPage] = useState(1);

  useEffect(() => {
    Log("frontend", "info", "page", "All notifications page loaded");
  }, []);

  useEffect(() => {
    setPage(1);
    Log("frontend", "info", "state", "Filter synced from URL", { filter, typeParam });
  }, [typeParam, filter]);

  const { data, isLoading, isError, refetch } = useNotifications(page, PAGE_SIZE, filter);

  const filteredItems = useMemo(
    () => (data?.items ?? []).filter((n) => matchesSearch(search, n)),
    [data?.items, search]
  );

  const totalPages = useMemo(() => {
    const total = data?.total ?? PAGE_SIZE;
    return Math.max(1, Math.ceil(total / PAGE_SIZE));
  }, [data?.total]);

  const handleFilterChange = (event) => {
    const value = event.target.value;
    Log("frontend", "info", "component", "Notification filter changed", { filter: value });

    const href =
      value === "All" ? "/notifications" : `/notifications?type=${encodeURIComponent(value)}`;
    router.push(href);
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        All Notifications
      </Typography>

      <FormControl size="small" sx={{ minWidth: 200, mb: 3 }}>
        <InputLabel id="filter-label">Filter by type</InputLabel>
        <Select
          labelId="filter-label"
          label="Filter by type"
          value={filter}
          onChange={handleFilterChange}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Placement">Placement</MenuItem>
          <MenuItem value="Result">Result</MenuItem>
          <MenuItem value="Event">Event</MenuItem>
        </Select>
      </FormControl>

      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Unable to load notifications. Showing cached or mock data if available.
        </Alert>
      )}

      {isLoading ? (
        Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} variant="rounded" height={96} sx={{ mb: 1.5 }} />
        ))
      ) : (
        <>
          <NotificationTable rows={filteredItems} onRead={() => refetch()} />
          <Box sx={{ display: { xs: "block", sm: "none" } }}>
            {filteredItems.map((n) => (
              <NotificationListItem key={n.id} notification={n} onRead={() => refetch()} />
            ))}
          </Box>
        </>
      )}

      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => {
            Log("frontend", "info", "component", "Pagination changed", { page: value });
            setPage(value);
          }}
          color="primary"
        />
      </Box>
    </Box>
  );
}
