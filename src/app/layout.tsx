import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from "next";
import { ThemeProvider } from 'next-themes';

import Provider from './Provider';

import "./globals.css";
import { GoogleUtilities, MicrosoftClarity, UmamiAnalytics } from '@/components/Analytics';
import FullLoading from '@/components/FullLoading';
import pkg from '#/package.json';

export const metadata: Metadata = {
  title: `从这里开始 | ${process.env.NEXT_PUBLIC_APP_NAME}`,
  description: process.env.NEXT_PUBLIC_APP_DESC,
  keywords: process.env.NEXT_PUBLIC_APP_KEYWORDS,
  authors: [{ name: process.env.NEXT_PUBLIC_COPYRIGHT, url: pkg.author.url }],
  creator: process.env.NEXT_PUBLIC_COPYRIGHT,
  publisher: process.env.NEXT_PUBLIC_COPYRIGHT,
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: process.env.NEXT_PUBLIC_APP_NAME,
    description: process.env.NEXT_PUBLIC_APP_DESC,
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: process.env.NEXT_PUBLIC_APP_NAME,
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/og.png`,
        width: 1200,
        height: 630,
      }
    ],
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: process.env.NEXT_PUBLIC_APP_NAME,
    description: process.env.NEXT_PUBLIC_APP_DESC,
    creator: 'baiwumm',
    images: [`${process.env.NEXT_PUBLIC_APP_URL}/og.png`],
  },
  manifest: `${process.env.NEXT_PUBLIC_APP_URL}/manifest.json`
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <meta name="version" content={pkg.version} />
        <link rel="stylesheet" href="https://cdn.baiwumm.com/fonts/MapleMono-CN-Regular/result.css" />
        {/* Umami 统计 */}
        <UmamiAnalytics />
        {/* Google 统计 */}
        <GoogleUtilities />
        {/* 微软统计 */}
        <MicrosoftClarity />
        {/* Vercel 分析 */}
        <Analytics />
      </head>
      <body>
        <ThemeProvider attribute="class" enableSystem={false}>
          <FullLoading>
            <Provider>
              {children}
            </Provider>
          </FullLoading>
        </ThemeProvider>
      </body>
    </html>
  );
}
