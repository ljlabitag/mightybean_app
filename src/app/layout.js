import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/navbar/navbar";
import Footer from "../components/footer/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MightyBean App",
  description: "Simple order intake system created using Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar/>{children}
        <Footer/>
      </body>
    </html>
  );
}
