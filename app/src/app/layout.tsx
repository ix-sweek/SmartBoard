import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SmartBoard",
  description: "Self-hosted Trello-like dashboard with Google integrations",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
