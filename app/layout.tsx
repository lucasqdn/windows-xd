import type { Metadata } from "next";
import { Pixelify_Sans, Tektur } from "next/font/google";
import "./globals.css";

const pixelifySans = Pixelify_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const tektur = Tektur({
  weight: ["700", "900"],
  subsets: ["latin"],
  variable: "--font-digital",
});

export const metadata: Metadata = {
  title: "Windows XD - A Windows 98 Revival",
  description: "Experience the nostalgia of Windows 98 on the web, rebuilt with modern React and Next.js",
  icons: {
    icon: "/icons8-windows-98-48.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${pixelifySans.className} ${tektur.variable}`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
