"use client";

import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#5B4FCF",
      dark: "#4338A8",
      light: "#7C6FE0",
    },
    secondary: {
      main: "#2D325A",
    },
    background: {
      default: "#F4F6FB",
      paper: "#FFFFFF",
    },
    success: { main: "#2E9E6A" },
    warning: { main: "#E67E22" },
    error: { main: "#D64545" },
    info: { main: "#3B82F6" },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 4px 20px rgba(45, 50, 90, 0.08)",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: "none",
        },
      },
    },
  },
});

export const priorityChipColor = {
  Placement: { bg: "#EDE9FE", color: "#5B4FCF", label: "High" },
  Result: { bg: "#FFF4E5", color: "#E67E22", label: "Medium" },
  Event: { bg: "#E8F8EF", color: "#2E9E6A", label: "Low" },
};
