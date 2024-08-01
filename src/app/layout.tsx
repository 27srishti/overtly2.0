import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Head from "next/head";
import { Montserrat } from "next/font/google";
import { Raleway } from "next/font/google";

export const metadata: Metadata = {
  title: "Your AI Publist",
  description: "Next gen PR automation platform",
  icons: {
    icon: "/favicon.png",
  },
};

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
});

const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-raleway",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.png" sizes="any" />
      </Head>
      <body
        className={
          montserrat.variable + " " + raleway.variable + " " + inter.variable
        }
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
