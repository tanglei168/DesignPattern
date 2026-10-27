import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { Providers } from "@/components/providers";
import "./globals.css";

const GOOGLE_FONTS =
  "https://fonts.googleapis.com/css2?family=Archivo+Black&family=Bebas+Neue&family=Caveat:wght@500;700&family=DM+Serif+Display&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Noto+Sans+SC:wght@400;500;700&family=Noto+Serif+SC:wght@500;700&family=Orbitron:wght@500;700&family=Playfair+Display:wght@500;700&family=Poppins:wght@400;500;600;700&family=Press+Start+2P&family=Roboto:wght@400;500;700&family=Space+Grotesk:wght@400;500;600;700&display=swap";

export const metadata: Metadata = {
  title: {
    default: "设计范式库 · Design Style Gallery",
    template: "%s · 设计范式库",
  },
  description:
    "浏览 Web 与移动端设计范式，查看设计规范，并下载可直接交给下游设计或编码代理使用的 design token。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href={GOOGLE_FONTS} rel="stylesheet" />
      </head>
      <body className="min-h-full bg-background text-foreground">
        <Providers>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:shadow"
          >
            跳到主要内容
          </a>
          {children}
        </Providers>
      </body>
    </html>
  );
}
