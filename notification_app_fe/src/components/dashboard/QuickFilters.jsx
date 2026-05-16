"use client";

import { Box, Card, CardContent, IconButton, Typography } from "@mui/material";
import AppsIcon from "@mui/icons-material/Apps";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import { Log } from "@campus/logging-middleware";

const filters = [
  { label: "All", icon: AppsIcon },
  { label: "Placement", icon: WorkOutlineIcon },
  { label: "Result", icon: EmojiEventsOutlinedIcon },
  { label: "Event", icon: EventOutlinedIcon },
];

export function QuickFilters({ active, onChange }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Quick Filters
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 1 }}>
          {filters.map(({ label, icon: Icon }) => {
            const selected = active === label;
            return (
              <IconButton
                key={label}
                onClick={() => {
                  Log("frontend", "info", "component", "Quick filter selected", { label });
                  onChange(label);
                }}
                sx={{
                  flexDirection: "column",
                  borderRadius: 2,
                  py: 2,
                  bgcolor: selected ? "primary.main" : "background.default",
                  color: selected ? "#fff" : "text.secondary",
                  "&:hover": {
                    bgcolor: selected ? "primary.dark" : "action.hover",
                  },
                }}
              >
                <Icon />
                <Typography variant="caption" sx={{ mt: 0.5 }}>
                  {label === "All" ? "All" : `${label}s`}
                </Typography>
              </IconButton>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
}
