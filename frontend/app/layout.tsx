import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import { Toaster } from "@/components/ui/sonner"
import "./globals.css";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["vietnamese"],
});

export const metadata: Metadata = {
  title: "Rano EPUB Reader | Meoki",
  description:
    "Trình đọc Light Novel gốc Nhật dưới dạng sách điện tử được chia sẻ từ Meoki.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lexend.variable} antialiased`}>{children}<Toaster /></body>
    </html>
  );
}
