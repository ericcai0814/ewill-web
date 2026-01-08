import type { Metadata } from "next";
import { Header, Footer } from "@/components/layout";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "鎰威科技 | 企業資安與智慧製造數位轉型專家",
    template: "%s | 鎰威科技",
  },
  description: "鎰威科技專注於企業數位轉型，整合資訊安全、AI 智慧製造與大數據應用。提供從規劃到導入的一站式解決方案，攜手國際品牌打造安全高效的數位企業。",
  keywords: [
    "鎰威科技",
    "Ewill",
    "數位轉型",
    "企業資安",
    "資訊安全服務",
    "智慧製造",
    "AI 應用",
    "大數據分析",
  ],
  authors: [{ name: "鎰威科技" }],
  openGraph: {
    type: "website",
    locale: "zh_TW",
    url: "https://www.ewill.com.tw",
    siteName: "鎰威科技",
    title: "鎰威科技 | 企業資安與智慧製造數位轉型專家",
    description: "鎰威科技專注於企業數位轉型，整合資訊安全、AI 智慧製造與大數據應用。",
  },
  twitter: {
    card: "summary_large_image",
    title: "鎰威科技 | 企業資安與智慧製造數位轉型專家",
    description: "鎰威科技專注於企業數位轉型，整合資訊安全、AI 智慧製造與大數據應用。",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
