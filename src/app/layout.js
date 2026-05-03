import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getTheme, buildThemeCss } from '@/lib/theme';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Salam Small Goods – Premium Halal Meats & Smallgoods",
  description:
    "Family-owned butcher shop offering fresh, halal-certified meats and house-made smallgoods in Broadmeadows, VIC.",
};

export default async function RootLayout({ children }) {
  const theme = await getTheme();
  const themeCss = buildThemeCss(theme);

  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeCss }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
