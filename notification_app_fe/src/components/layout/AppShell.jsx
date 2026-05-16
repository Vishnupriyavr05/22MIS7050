"use client";

import { useEffect, useState } from "react";
import { Box, Toolbar } from "@mui/material";
import { Log } from "@campus/logging-middleware";
import { SearchProvider } from "@/context/SearchContext";
import { Header } from "./Header";
import { Sidebar, SIDEBAR_WIDTH } from "./Sidebar";

export function AppShell({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    Log("frontend", "info", "component", "App shell mounted");
  }, []);

  return (
    <SearchProvider>
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
        <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { md: `calc(100% - ${SIDEBAR_WIDTH}px)` },
            minWidth: 0,
          }}
        >
          <Header onMenuClick={() => setMobileOpen(true)} />
          <Toolbar sx={{ display: { xs: "block", md: "none" }, minHeight: 0 }} />
          <Box sx={{ p: { xs: 2, md: 3 } }}>{children}</Box>
        </Box>
      </Box>
    </SearchProvider>
  );
}
