import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Patel Villa — Architectural Scroll Experience",
  description:
    "An Apple-style frame-by-frame scrubbed spatial sequence through the architectural interior and grounds of Patel Villa.",
  keywords: ["Patel Villa", "Luxury Architecture", "Spatial Tour", "Scroll Scrubbing", "Modern Residence"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${plusJakarta.variable} ${jetbrainsMono.variable} dark antialiased`}
    >
      <body className="min-h-screen bg-[#09090b] text-neutral-100 font-sans overflow-x-hidden selection:bg-neutral-200 selection:text-neutral-900">
        {children}
      </body>
    </html>
  );
}
