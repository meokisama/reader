import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { redirect } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Raw Ranobe Reader | Meoki",
  description:
    "Trình đọc Light Novel gốc Nhật dưới dạng sách điện tử được chia sẻ từ Meoki.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  redirect("https://ranobe.vn");
  // return (
  //   <html lang="en">
  //     <body
  //       className={`${geistSans.variable} ${geistMono.variable} antialiased`}
  //     >
  //       {children}
  //     </body>
  //   </html>
  // );
}
