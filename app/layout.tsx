import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { PostHogProvider } from "../components/PostHogProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Atomic Agility | Agile Coaching & SAFe Training",
  description: "Agile coaching and consulting built for the AI age.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-navy text-white antialiased`}>
        <PostHogProvider>
          <Nav />
          {children}
          <Footer />
        </PostHogProvider>
      </body>
    </html>
  );
}
