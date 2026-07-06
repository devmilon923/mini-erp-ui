import "./globals.css";
import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";

const body = Inter({ subsets: ["latin"], variable: "--font-body" });
const heading = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "MiniERP — Inventory & Sales",
  description: "A precision inventory and sales console for modern commerce.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${body.variable} ${heading.variable}`}>
      <body>{children}</body>
    </html>
  );
}
