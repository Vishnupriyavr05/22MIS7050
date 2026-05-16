"use client";

import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Log } from "@campus/logging-middleware";
import {
  clearAuthStorage,
  generateBearerToken,
  getStoredBearerToken,
  registerUser,
} from "@/lib/api/auth";

export default function SettingsPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    rollNo: "",
    mobileNo: "",
    githubUsername: "",
    accessCode: process.env.NEXT_PUBLIC_ACCESS_CODE ?? "",
  });
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const hasToken = Boolean(getStoredBearerToken());

  const handleRegister = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      Log("frontend", "info", "page", "User initiated registration");
      const res = await registerUser(form);
      const id = res.clientID ?? res.clientId ?? "";
      setClientId(id);
      setClientSecret(res.clientSecret ?? "");
      setMessage("Registration successful. Save your client credentials.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Registration failed");
      Log("frontend", "error", "page", "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleToken = async () => {
    setLoading(true);
    setError(null);
    try {
      await generateBearerToken(clientId || undefined, clientSecret || undefined);
      setMessage("Bearer token generated and stored.");
      Log("frontend", "info", "page", "Bearer token generated from settings");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Token generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxWidth={640}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Register with the evaluation service, then generate a bearer token for API access.
      </Typography>

      {hasToken && <Alert severity="success" sx={{ mb: 2 }}>Bearer token is configured.</Alert>}
      {message && <Alert severity="info" sx={{ mb: 2 }}>{message}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            1. Register
          </Typography>
          <Stack spacing={2}>
            {["name", "email", "rollNo", "mobileNo", "githubUsername", "accessCode"].map(
              (field) => (
                <TextField
                  key={field}
                  label={field}
                  fullWidth
                  value={form[field]}
                  onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                />
              )
            )}
            <Button variant="contained" onClick={handleRegister} disabled={loading}>
              Register
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            2. Generate Bearer Token
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="Client ID"
              fullWidth
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
            />
            <TextField
              label="Client Secret"
              fullWidth
              type="password"
              value={clientSecret}
              onChange={(e) => setClientSecret(e.target.value)}
            />
            <Stack direction="row" spacing={1}>
              <Button variant="contained" onClick={handleToken} disabled={loading}>
                Generate Token
              </Button>
              <Button
                variant="outlined"
                color="warning"
                onClick={() => {
                  clearAuthStorage();
                  setMessage("Credentials cleared.");
                }}
              >
                Clear
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
