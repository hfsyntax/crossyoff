import { Inter } from "next/font/google";
import "./globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css"
import Container from "./components/shared/Container";
import Navbar from "./components/shared/Navbar";
import Footer from "./components/shared/Footer"

const inter = Inter({ subsets: ["latin"] });



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Container id="wrapper">
          <Navbar/>
          {children}
          <Footer/>
        </Container>
      </body>
    </html>
  )
}