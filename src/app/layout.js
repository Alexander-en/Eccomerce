import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GlobalState from "@/context";
import Navbar from "@/components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "My Ecommerce Store",
  description: "My awesome ecommerce website",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
      <GlobalState>
        <Navbar />
        <main className="flex min-h-screen flex-col mt-20"> {children}</main>
      </GlobalState>
      </body>
    </html>
  );
}

//mt-16.25
