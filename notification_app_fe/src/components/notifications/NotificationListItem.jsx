"use client";

import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Typography,
} from "@mui/material";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import { priorityChipColor } from "@/theme/theme";
import { formatTimestamp } from "@/utils/format";
import { markNotificationRead } from "@/lib/notifications/readState";

const typeIcons = {
  Placement: WorkOutlineIcon,
  Result: EmojiEventsOutlinedIcon,
  Event: EventOutlinedIcon,
};

export function NotificationListItem({ notification, onRead, compact }) {
  const Icon = typeIcons[notification.notification_type];
  const chip = priorityChipColor[notification.notification_type];

  const handleMarkRead = () => {
    if (!notification.is_read) {
      markNotificationRead(notification.id);
      onRead?.();
    }
  };

  return (
    <Card
      variant="outlined"
      sx={{
        mb: 1.5,
        borderColor: notification.is_read ? "divider" : "primary.light",
        bgcolor: notification.is_read ? "background.paper" : "rgba(91, 79, 207, 0.04)",
      }}
      onClick={handleMarkRead}
    >
      <CardContent
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "flex-start",
          py: compact ? 1.5 : 2,
          "&:last-child": { pb: compact ? 1.5 : 2 },
        }}
      >
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2,
            bgcolor: chip.bg,
            color: chip.color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon />
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, mb: 0.5 }}>
            <Typography variant="subtitle1" fontWeight={600} noWrap>
              {notification.title ?? notification.notification_type}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
              {formatTimestamp(notification.created_at)}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {notification.message}
          </Typography>
          <Chip
            size="small"
            label={`${chip.label} · ${notification.notification_type}`}
            sx={{ bgcolor: chip.bg, color: chip.color, fontWeight: 600 }}
          />
        </Box>

        {!notification.is_read && (
          <IconButton
            size="small"
            sx={{
              width: 10,
              height: 10,
              bgcolor: "info.main",
              borderRadius: "50%",
              p: 0,
              mt: 1,
              "&:hover": { bgcolor: "info.dark" },
            }}
            aria-label="Unread"
          />
        )}
      </CardContent>
    </Card>
  );
}
