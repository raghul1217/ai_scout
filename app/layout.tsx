import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "AI Scout — Discover, Learn & Stay Ahead in AI",
    template: "%s | AI Scout",
  },
  description:
    "AI Scout is your all-in-one AI discovery and learning platform. Explore curated AI tools, read the latest AI news, and access practical tutorials to stay ahead.",
  keywords: ["AI tools", "AI news", "learn AI", "artificial intelligence", "AI community", "AI tutorials"],
  authors: [{ name: "AI Scout" }],
  creator: "AI Scout",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://aiscout.in"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "AI Scout",
    title: "AI Scout — Discover, Learn & Stay Ahead in AI",
    description:
      "Your all-in-one AI discovery and learning platform. Curated tools, latest news, practical tutorials.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI Scout",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Scout — Discover, Learn & Stay Ahead in AI",
    description: "Curated AI tools, latest AI news, practical tutorials.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#050816",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#050816] text-[#f8fafc] font-sans antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
