"use client";

import { Card, CardContent, Grid2 as Grid, Typography, Box } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

function StatCard({ title, value, subtitle, accent }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" fontWeight={700}>
          {value}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 1 }}>
          {accent ? (
            <Typography variant="caption" sx={{ color: accent, fontWeight: 600 }}>
              {subtitle}
            </Typography>
          ) : (
            <>
              <TrendingUpIcon sx={{ fontSize: 16, color: "success.main" }} />
              <Typography variant="caption" color="success.main">
                {subtitle}
              </Typography>
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export function StatCards({ total, unread, priority }) {
  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid size={{ xs: 12, sm: 4 }}>
        <StatCard title="Total Notifications" value={total} subtitle="↑ 12% from last week" />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <StatCard title="Unread Notifications" value={unread} subtitle="↑ 5% from yesterday" />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <StatCard
          title="Priority Notifications"
          value={priority}
          subtitle="High priority unread"
          accent="error.main"
        />
      </Grid>
    </Grid>
  );
}
