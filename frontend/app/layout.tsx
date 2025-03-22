import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["vietnamese"],
});

const title = "Ranobe EPUB Reader | Meoki";
const description = "Trình đọc Light Novel gốc Nhật dưới dạng sách điện tử được chia sẻ từ Meoki.";

export const metadata: Metadata = {
  title: title,
  description: description,
  creator: "Meoki",
  publisher: "Meoki",
  keywords: [
    "light novel",
    "ln",
    "ranobe",
    "blog",
    "tiểu thuyết",
    "light novel blog",
    "ranobe epub reader",
    "epub raw",
    "ranobe raw",
    "ranobe vn",
    "ranobe vn raw",
    "ranobe vn raw reader",
  ],
  metadataBase: new URL("https://ranobe.vn"),
  openGraph: {
    title: title,
    description: description,
    siteName: title,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: title,
    description: description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lexend.variable} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
