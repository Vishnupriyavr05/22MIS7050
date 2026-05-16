"use client";

import {
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { priorityChipColor } from "@/theme/theme";
import { formatTimestamp } from "@/utils/format";
import { markNotificationRead } from "@/lib/notifications/readState";

export function NotificationTable({ rows, onRead }) {
  return (
    <TableContainer component={Paper} sx={{ display: { xs: "none", sm: "block" } }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Type</TableCell>
            <TableCell>Message</TableCell>
            <TableCell>Timestamp</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => {
            const chip = priorityChipColor[row.notification_type];
            return (
              <TableRow
                key={row.id}
                hover
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  if (!row.is_read) {
                    markNotificationRead(row.id);
                    onRead?.();
                  }
                }}
              >
                <TableCell>
                  <Chip
                    size="small"
                    label={row.notification_type}
                    sx={{ bgcolor: chip.bg, color: chip.color }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight={600}>
                    {row.title ?? row.notification_type}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {row.message}
                  </Typography>
                </TableCell>
                <TableCell>{formatTimestamp(row.created_at)}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={row.is_read ? "Read" : "Unread"}
                    color={row.is_read ? "default" : "primary"}
                    variant={row.is_read ? "outlined" : "filled"}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
