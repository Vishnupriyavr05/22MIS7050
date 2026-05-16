import { AppProviders } from "@/providers/AppProviders";
import { AppShell } from "@/components/layout/AppShell";
import "./globals.css";

export const metadata = {
  title: "Campus Connect — Notifications",
  description: "Campus notification dashboard for placements, results, and events",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          <AppShell>{children}</AppShell>
        </AppProviders>
      </body>
    </html>
  );
}
