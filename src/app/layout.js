import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/navbar/navbar";
import Footer from "../components/footer/footer";
import AuthProvider from "./context/AuthProvider";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MightyBean App",
  description: "Simple order intake system created using Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <AuthProvider>
      <body className='min-h-screen'>
        <Navbar/>{children}
        <Footer/>
      </body>
      </AuthProvider>
    </html>
  );
}
