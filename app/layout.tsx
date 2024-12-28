import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Refella",
  description: "Reflect and share your work through AI-generated posts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
