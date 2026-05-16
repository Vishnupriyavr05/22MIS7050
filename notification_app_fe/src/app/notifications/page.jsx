import { Suspense } from "react";
import { Box, CircularProgress } from "@mui/material";
import { NotificationsPageClient } from "./NotificationsPageClient";

export default function AllNotificationsPage() {
  return (
    <Suspense
      fallback={
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      }
    >
      <NotificationsPageClient />
    </Suspense>
  );
}
