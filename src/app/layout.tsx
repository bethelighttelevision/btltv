import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import Preloader from "@/components/Preloader";
import Chatbot from "@/components/Chatbot";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0a0a0f",
  viewportFit: "auto",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://btl-tv.com"),
  title: "BTL TV — Be The Light Television",
  description:
    "BTL TV is a Christian faith-based television platform broadcasting in Urdu for Pakistani-speaking communities worldwide. Watch devotional programs, talk shows, dramas, and more.",
  keywords: [
    "BTL TV",
    "Be The Light Television",
    "Christian TV",
    "Urdu Christian",
    "Pakistani Christian",
    "devotional",
    "Christian programs",
    "Urdu TV",
    "Bible Urdu",
    "Christian drama",
    "Pakistani Christian community",
  ],
  authors: [{ name: "BTL TV", url: "https://btl-tv.com" }],
  creator: "BTL TV",
  publisher: "Be The Light Television",
  alternates: {
    canonical: "https://btl-tv.com",
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "BTL TV — Be The Light Television",
    description: "Christian faith-based television broadcasting in Urdu for Pakistani-speaking communities worldwide. Watch devotional programs, talk shows, dramas, and the Urdu Audio Bible.",
    type: "website",
    url: "https://btl-tv.com",
    siteName: "BTL TV",
    locale: "en_US",
    images: [
      {
        url: "/images/btl-logo.webp",
        width: 1200,
        height: 630,
        alt: "BTL TV — Be The Light Television",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BTL TV — Be The Light Television",
    description: "Christian faith-based television broadcasting in Urdu for Pakistani-speaking communities worldwide.",
    images: ["/images/btl-logo.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="BTL TV" />
        <meta name="application-name" content="BTL TV" />
        <meta name="msapplication-TileColor" content="#0a0a0f" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-5CFNBEXJLW`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-5CFNBEXJLW');
            `,
          }}
        />
        {/* Service Worker Registration */}
        <Script
          id="service-worker-registration"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js', { scope: '/' }).then(function(reg) {
                    console.log('SW registered:', reg.scope);
                  }).catch(function(err) {
                    console.log('SW registration failed:', err);
                  });
                });
              }
            `,
          }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Preloader />
          <Chatbot />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
