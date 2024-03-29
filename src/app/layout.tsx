import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"
import Head from "next/head";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Your AI Publist",
  description: "Next gen PR automation platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
          <Head>
          <meta charSet="utf-8" />
          <link rel="icon" href="/images.png" />
        </Head>
      <body className={inter.className}>
          {children}
          <Toaster />
      </body>
    </html>
  );
}
