import "./globals.css";
import { EB_Garamond, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "700", "800"],
  style: ["normal", "italic"],
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "600", "700", "800"],
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["600", "700"],
});

export const metadata = {
  title: "Pursuit - Discover real-life experiences in Nairobi",
  description:
    "Pursuit is a Nairobi-first event discovery platform for finding, saving, and planning real-life experiences.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${ebGaramond.variable} ${hankenGrotesk.variable} ${jetBrainsMono.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
