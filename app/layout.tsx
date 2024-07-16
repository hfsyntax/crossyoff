import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css"
import { ReactNode } from "react"
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "CrossyOff - Home",
    template: "CrossyOff - %s"
  },
  description: "Website for the Competitive Crossy Road Community",
  applicationName: "CrossyOff",
  referrer: "origin-when-cross-origin",
  keywords: ["CrossyOff", "crossyoff", "crossyoff crossyroad", "ccrc", "Crossy Road", "Crossy Road Discord", "Crossy Road Community", "Crossy Road Server", "Crossy Road Highscores", "Crossy Road Rankings", "Crossy Road League"],
  authors: [{name: "Noah Kaiser", url: "https://noahkaiser.vercel.app"}],
  creator: "Noah Kaiser",
  publisher: "Noah Kaiser",
  metadataBase: new URL("https://crossyoff.vercel.app"),
  openGraph: {
    title: "CrossyOff - Home",
    description: "Website for the Competitive Crossy Road Community",
    type: "website",
    locale: "en_US",
    url: "https://crossyoff.vercel.app",
    siteName: "CrossyOff",
    images: "/opengraph-image.png"
  }
}

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div id="wrapper">
          <Navbar />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  )
}