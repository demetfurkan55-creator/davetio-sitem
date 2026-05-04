import type { Metadata, Viewport } from "next";
import { Caveat, DM_Sans, Fraunces, Geist_Mono } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const accentScript = Caveat({
  variable: "--font-accent",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "Davetio",
  description: "Premium dijital davetiye platformu",
};

export const viewport: Viewport = {
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
      lang="tr"
      suppressHydrationWarning
      className={`${dmSans.variable} ${geistMono.variable} ${display.variable} ${accentScript.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-[100dvh] min-h-full flex-col bg-canvas text-ink font-sans">
        {children}
      </body>
    </html>
  );
}
