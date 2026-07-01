import type { Metadata, Viewport } from "next";
import {
  Geist,
  Geist_Mono,
  Sora,
  Hanken_Grotesk,
  JetBrains_Mono,
  Roboto_Mono,
} from "next/font/google";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css"; // Required for styling
import PWAProvider from "@/components/pwa/PWAProvider";
import { ToastContainer } from "react-toastify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const roboto = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-roboto",
});

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-sora", // Maps to a clean CSS variable
});
const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-hanken",
});
const jet = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-jet",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://voltops.app"),

  title: {
    default: "VoltOps",
    template: "%s | VoltOps",
  },
  description:
    "AI-powered EV Repair Intelligence Platform for workshops, battery repair centers, and EV service businesses.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/favicon.ico" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    title: "VoltOps",
    statusBarStyle: "black-translucent",
  },
  applicationName: "VoltOps",
};

export const viewport: Viewport = {
  themeColor: "#091426",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${hanken.variable} ${jet.variable} ${geistSans.variable} ${geistMono.variable} ${roboto.variable} bg-[#121416] text-[#e2e2e5] h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">

        <PWAProvider> 
          {children}
        </PWAProvider>

        <ToastContainer position="top-right" />
      </body>
    </html>
  );
}
