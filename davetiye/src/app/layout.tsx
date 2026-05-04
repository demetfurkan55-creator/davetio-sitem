import type { Metadata, Viewport } from "next";
import { Geist_Mono, Great_Vibes, Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Davetio",
  description: "Sinematik dijital düğün davetiyesi deneyimi",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fdf9f9" },
    { media: "(prefers-color-scheme: dark)", color: "#2a0a12" },
  ],
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
      className={`${montserrat.variable} ${geistMono.variable} ${playfair.variable} ${greatVibes.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-[100dvh] min-h-full flex-col bg-canvas text-ink font-sans">
        {children}
      </body>
    </html>
  );
}
