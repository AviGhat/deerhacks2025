import "./globals.css"; 
import "./google.css";  

import { Geist, Geist_Mono, Cantora_One } from "next/font/google"; // ✅ Import Cantora One

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cantoraOne = Cantora_One({
  variable: "--font-cantora", // ✅ Custom variable for the font
  subsets: ["latin"],
  weight: "400", // ✅ Cantora One only has one weight
});

export const metadata = {
  title: "DiscoverMe",
  description: "Discover the World through You",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${cantoraOne.variable}`}>
        {children}
        <div className="footer-bar">
      <footer>
        Aviraj Ghatora, Haashir Khan  
      </footer>
      </div>
      </body>
    </html>
  );
}