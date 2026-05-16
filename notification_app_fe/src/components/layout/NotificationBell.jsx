"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Popover,
  Typography,
} from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { Log } from "@campus/logging-middleware";
import { useNotificationPool } from "@/hooks/useNotificationPool";
import { markNotificationRead } from "@/lib/notifications/readState";
import { formatTimestamp } from "@/utils/format";

export function NotificationBell() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [anchorEl, setAnchorEl] = useState(null);
  const { unreadCount, recentUnread, refetch } = useNotificationPool();

  const open = Boolean(anchorEl);

  const handleOpen = (event) => {
    Log("frontend", "info", "component", "Notification bell opened", { unreadCount });
    setAnchorEl(event.currentTarget);
    void refetch();
  };

  const handleClose = () => setAnchorEl(null);

  const handleNotificationClick = (id) => {
    markNotificationRead(id);
    Log("frontend", "info", "component", "Notification opened from bell menu", { id });
    void queryClient.invalidateQueries({ queryKey: ["top-notifications-pool"] });
    void queryClient.invalidateQueries({ queryKey: ["notifications"] });
    handleClose();
    router.push("/notifications");
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
        sx={{
          bgcolor: open ? "action.selected" : "transparent",
          "&:hover": { bgcolor: "action.hover" },
        }}
      >
        <Badge badgeContent={unreadCount} color="error" max={99} invisible={unreadCount === 0}>
          <NotificationsNoneIcon />
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: { sx: { width: 360, maxWidth: "100vw", mt: 1 } },
        }}
      >
        <Box sx={{ px: 2, py: 1.5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Typography variant="caption" color="text.secondary">
              {unreadCount} unread
            </Typography>
          )}
        </Box>
        <Divider />

        {recentUnread.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
            No unread notifications
          </Typography>
        ) : (
          <List dense disablePadding sx={{ maxHeight: 320, overflow: "auto" }}>
            {recentUnread.map((n) => (
              <ListItemButton key={n.id} onClick={() => handleNotificationClick(n.id)}>
                <ListItemText
                  primary={n.title ?? n.notification_type}
                  secondary={
                    <>
                      <Typography component="span" variant="caption" display="block" noWrap>
                        {n.message}
                      </Typography>
                      <Typography component="span" variant="caption" color="text.secondary">
                        {formatTimestamp(n.created_at)}
                      </Typography>
                    </>
                  }
                  primaryTypographyProps={{ fontWeight: 600, noWrap: true }}
                />
              </ListItemButton>
            ))}
          </List>
        )}

        <Divider />
        <Box sx={{ p: 1.5, display: "flex", gap: 1 }}>
          <Button
            component={Link}
            href="/priority-inbox"
            size="small"
            variant="contained"
            fullWidth
            onClick={handleClose}
          >
            Priority Inbox
          </Button>
          <Button
            component={Link}
            href="/notifications"
            size="small"
            variant="outlined"
            fullWidth
            onClick={handleClose}
          >
            View all
          </Button>
        </Box>
      </Popover>
    </>
  );
}
