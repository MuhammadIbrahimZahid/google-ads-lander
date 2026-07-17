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
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? ""}`}
        strategy="afterInteractive"
      />

      <Script id="google-analytics" strategy="afterInteractive">
        {`
          if (!window.gtag) {
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;

            const GA_ID = "${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? ""}";

            if (GA_ID) {
              gtag('js', new Date());
              gtag('config', GA_ID,);
            }
          }
        `}
      </Script>

      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
