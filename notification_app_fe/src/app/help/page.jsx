"use client";

import { Typography, Box, Card, CardContent } from "@mui/material";

export default function HelpPage() {
  return (
    <Box maxWidth={720}>
      <Typography variant="h4" gutterBottom>
        Help & Support
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="body1" paragraph>
            Use the Priority Inbox for the most important unread updates. Placement
            notifications are ranked highest, followed by results and events.
          </Typography>
          <Typography variant="body1">
            Configure API credentials under Settings using your evaluation access code.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
