"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Box,
  Button,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Badge,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import { useNotificationPool } from "@/hooks/useNotificationPool";
import { bottomNavItems, mainNavItems } from "./navItems";

const DRAWER_WIDTH = 260;

function isNavItemActive(href, pathname, searchParams) {
  const [path, queryString] = href.split("?");
  const hrefType = new URLSearchParams(queryString ?? "").get("type");

  if (pathname !== path) {
    return false;
  }

  if (path === "/notifications") {
    const currentType = searchParams.get("type");
    if (hrefType) {
      return currentType === hrefType;
    }
    return currentType === null;
  }

  return path === "/" || !hrefType;
}

function NavContent({ onNavigate }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { unreadCount } = useNotificationPool();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", p: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3, px: 1 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            bgcolor: "primary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
          }}
        >
          <SchoolIcon />
        </Box>
        <Typography variant="h6" sx={{ color: "#fff", fontWeight: 700 }}>
          Campus Connect
        </Typography>
      </Box>

      <List sx={{ flex: 1 }}>
        {mainNavItems.map((item) => {
          const active = isNavItemActive(item.href, pathname, searchParams);
          const Icon = item.icon;
          const badgeCount =
            item.href === "/priority-inbox" && unreadCount > 0 ? unreadCount : undefined;
          return (
            <ListItemButton
              key={item.href}
              component={Link}
              href={item.href}
              selected={active}
              onClick={onNavigate}
              sx={{
                mb: 0.5,
                borderRadius: 2,
                color: active ? "#fff" : "rgba(255,255,255,0.75)",
                bgcolor: active ? "primary.main" : "transparent",
                "&:hover": { bgcolor: active ? "primary.dark" : "rgba(255,255,255,0.08)" },
              }}
            >
              <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
                {badgeCount ? (
                  <Badge badgeContent={badgeCount} color="error">
                    <Icon fontSize="small" />
                  </Badge>
                ) : (
                  <Icon fontSize="small" />
                )}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>

      <List>
        {bottomNavItems.map((item) => {
          const active = isNavItemActive(item.href, pathname, searchParams);
          const Icon = item.icon;
          return (
            <ListItemButton
              key={item.href}
              component={Link}
              href={item.href}
              selected={active}
              onClick={onNavigate}
              sx={{
                borderRadius: 2,
                color: active ? "#fff" : "rgba(255,255,255,0.7)",
                bgcolor: active ? "primary.main" : "transparent",
                "&:hover": { bgcolor: active ? "primary.dark" : "rgba(255,255,255,0.08)" },
              }}
            >
              <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
                <Icon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>

      <Box
        sx={{
          mt: 2,
          p: 2,
          borderRadius: 2,
          bgcolor: "rgba(255,255,255,0.08)",
        }}
      >
        <Typography variant="subtitle2" sx={{ color: "#fff", mb: 1 }}>
          Never miss important updates
        </Typography>
        <Button variant="contained" size="small" fullWidth sx={{ bgcolor: "#fff", color: "secondary.main" }}>
          Enable Now
        </Button>
      </Box>
    </Box>
  );
}

export function Sidebar({ mobileOpen, onMobileClose }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const drawerPaper = {
    width: DRAWER_WIDTH,
    boxSizing: "border-box",
    bgcolor: "secondary.main",
    border: "none",
  };

  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": drawerPaper,
        }}
      >
        <Suspense fallback={null}>
          <NavContent onNavigate={onMobileClose} />
        </Suspense>
      </Drawer>

      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={!isMobile || mobileOpen}
        sx={{
          display: { xs: "none", md: "block" },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": drawerPaper,
        }}
      >
        <Suspense fallback={null}>
          <NavContent />
        </Suspense>
      </Drawer>
    </>
  );
}

export const SIDEBAR_WIDTH = DRAWER_WIDTH;
