"use client";

import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { useSearch } from "@/context/SearchContext";
import { NotificationBell } from "./NotificationBell";

export function Header({ onMenuClick }) {
  const { search, setSearch } = useSearch();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "background.paper",
        color: "text.primary",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Toolbar sx={{ gap: 2, py: 1 }}>
        <IconButton edge="start" onClick={onMenuClick} sx={{ display: { md: "none" } }}>
          <MenuIcon />
        </IconButton>

        <TextField
          size="small"
          placeholder="Search notifications..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            flex: 1,
            maxWidth: 480,
            mx: { xs: 0, md: "auto" },
            "& .MuiOutlinedInput-root": { bgcolor: "background.default" },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, ml: "auto" }}>
          <NotificationBell />
          <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", gap: 1 }}>
            <Avatar sx={{ width: 36, height: 36, bgcolor: "primary.main" }}>AS</Avatar>
            <Box>
              <Typography variant="body2" fontWeight={600}>
                Hello, Aman
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Student
              </Typography>
            </Box>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
