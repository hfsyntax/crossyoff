import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/app/globals.css"
import "@fortawesome/fontawesome-svg-core/styles.css"
import { ReactNode } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

export const metadata: Metadata = {
  title: {
    default: "CrossyOff - A competitive Crossy Road community.",
    template: "CrossyOff - %s",
  },
  description:
    "A website storing infromation on the Competitive Crossy Road Community and top Crossy Road players.",
  applicationName: "CrossyOff",
  referrer: "origin-when-cross-origin",
  keywords: [
    "CrossyOff",
    "crossyoff",
    "crossyoff crossyroad",
    "ccrc",
    "Crossy Road",
    "Crossy Road Discord",
    "Crossy Road Community",
    "Crossy Road Server",
    "Crossy Road Highscores",
    "Crossy Road Rankings",
    "Crossy Road League",
  ],
  authors: [{ name: "Noah Kaiser", url: "https://noahkaiser.vercel.app" }],
  creator: "Noah Kaiser",
  publisher: "Noah Kaiser",
  metadataBase: new URL("https://crossyoff.vercel.app"),
  openGraph: {
    title: "CrossyOff - A competitive Crossy Road community.",
    description:
      "A website storing infromation on the Competitive Crossy Road Community and top Crossy Road players.",
    type: "website",
    locale: "en_US",
    url: "https://crossyoff.vercel.app",
    siteName: "CrossyOff",
    images: "/opengraph-image.png",
  },
}

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className={"absolute flex min-h-full w-full flex-col"}>
          <Navbar />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  )
}
