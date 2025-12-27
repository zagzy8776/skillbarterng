import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AnimatePresence } from "framer-motion";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://skillbarterng.vercel.app'),
  title: 'SkillBarterNG - Swap Skills with Naija University Students',
  description: 'Connect with campus mates to teach and learn skills like Graphics Design, Crypto Tips, Video Editing, Python, Makeup & more. Free skill swap community for Nigerian students.',
  openGraph: {
    title: 'SkillBarterNG',
    description: 'Swap skills with Naija university students 🔥',
    url: 'https://skillbarterng.vercel.app',
    siteName: 'SkillBarterNG',
    locale: 'en_NG',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased pt-20`}
      >
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-white text-black px-3 py-2 rounded">Skip to content</a>
        <Navbar />
        <main id="main" className="container" role="main">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
