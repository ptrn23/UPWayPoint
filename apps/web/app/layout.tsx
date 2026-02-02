import type { Metadata } from "next";
import { Chakra_Petch, Nunito } from "next/font/google";
import "./globals.css";

const chakra = Chakra_Petch({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-chakra",
});

const nunito = Nunito({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "UP WayPoint",
  description: "Lead the way!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${chakra.variable} ${nunito.variable}`}>
        {children}
      </body>
    </html>
  );
}
