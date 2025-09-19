import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";

const satoshi = localFont({
  src: [
    {
      path: "../app/fonts/satoshi/Satoshi-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../app/fonts/satoshi/Satoshi-Italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../app/fonts/satoshi/Satoshi-Medium.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../app/fonts/satoshi/Satoshi-Bold.woff2",
      weight: "700",
      style: "bold",
    },
  ],
});

export const metadata: Metadata = {
  title: "IT Helpdesk and Management System",
  description:
    "A modern IT Helpdesk and Asset Management System for efficient ticketing, support, and IT resource tracking. Streamline workflows, manage assets, and improve productivity.",
  keywords: [
    "IT Helpdesk",
    "Asset Management",
    "Ticketing System",
    "IT Support",
    "Issue Tracking",
    "IT Service Desk",
    "Workflow Management",
    "Productivity",
  ],
  authors: [{ name: "Nwanguma Emmanuel" }],
  openGraph: {
    title: "IT Helpdesk and Management System",
    description:
      "Streamlined IT support, ticketing, and asset management in one platform.",
    url: "https://yourdomain.com",
    siteName: "IT Helpdesk and Management System",
    images: [
      {
        url: "https://yourdomain.com/og-image.png", // replace with your OG image
        width: 1200,
        height: 630,
        alt: "IT Helpdesk and Management System",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  category: "productivity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://onyedikachinwanguma.vercel.app/" />
        <link rel="icon" href="/favicon.svg" />
      </head>
      <body className={`${satoshi.className} antialiased`}>{children}</body>
    </html>
  );
}
