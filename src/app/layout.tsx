import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Google Ads Lander",
  description:
    "A Next.js demo project showcasing Google Analytics 4 and Google Ads conversion tracking with a production-oriented architecture.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {GTM_ID && (
        <>
          {/* Initialize GTM dataLayer before loading GTM */}
          <Script id="google-tag-manager-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];

              window.dataLayer.push({
                'gtm.start': new Date().getTime(),
                event: 'gtm.js'
              });
            `}
          </Script>

          {/* Load Google Tag Manager */}
          <Script
            id="google-tag-manager"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`}
          />
        </>
      )}

      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
