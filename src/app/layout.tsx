import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LockScreen from "@/components/LockScreen";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kakeibo Finance Tracker",
  description: "Personal finance tracker based on Japanese Kakeibo method",
  manifest: "../../public/manifest.json",
  themeColor: "#0f172a",
  appleWebApp: {
    capable: true,
    title: "Kakeibo",
    statusBarStyle: "black-translucent",
  },
  icons: {
    apple: "/icons/icon-192x192.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="../../public/manifest.json" />
        <link rel="icon" href="./favicon.ico" sizes="any" />
        <meta name="theme-color" content="#0f172a" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Kakeibo" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
      </head>
      <body className={inter.className}>
        <div
          className="min-h-screen p-safe bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
          style={{ paddingTop: "env(safe-area-inset-top)" }}
        >
          <LockScreen />
          {children}
        </div>
      </body>
    </html>
  );
}
