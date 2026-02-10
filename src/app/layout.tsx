import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Situationship Radar",
  description: "Detect mixed signals and generate playful reply suggestions.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
