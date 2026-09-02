import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import LayoutContent from "@/components/LayoutContent";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Cyber - Tech Store",
  description: "Your trusted destination for the latest in technology",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen custom-scroll`}
      >
        <LayoutContent>{children}</LayoutContent>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}

