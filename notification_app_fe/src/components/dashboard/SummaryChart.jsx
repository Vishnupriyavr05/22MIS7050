"use client";

import { Box, Card, CardContent, Typography } from "@mui/material";

const segments = [
  { label: "Placements", value: 35, color: "#5B4FCF" },
  { label: "Results", value: 30, color: "#E67E22" },
  { label: "Events", value: 35, color: "#2E9E6A" },
];

export function SummaryChart() {
  const gradient = segments
    .reduce(
      (acc, seg) => {
        const end = acc.start + seg.value;
        acc.parts.push(`${seg.color} ${acc.start}% ${end}%`);
        acc.start = end;
        return acc;
      },
      { start: 0, parts: [] }
    )
    .parts.join(", ");

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Notification Summary
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap" }}>
          <Box
            sx={{
              width: 140,
              height: 140,
              borderRadius: "50%",
              background: `conic-gradient(${gradient})`,
              flexShrink: 0,
            }}
          />
          <Box>
            {segments.map((seg) => (
              <Box key={seg.label} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: seg.color }} />
                <Typography variant="body2">
                  {seg.label} — {seg.value}%
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
