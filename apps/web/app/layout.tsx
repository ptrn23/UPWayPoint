import type { Metadata } from "next";
import { Chakra_Petch, Nunito } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { TRPCProvider } from "@/components/TRPCProvider";

const chakra = Chakra_Petch({
	weight: ["300", "400", "500", "600", "700"],
	subsets: ["latin"],
	variable: "--font-chakra",
});

const nunito = Nunito({
	weight: ["400", "700"],
	subsets: ["latin"],
	variable: "--font-nunito",
});

const cubaoFree = localFont({
  src: "fonts/Cubao_Free_Regular.otf",
  variable: "--font-cubao",
  display: "swap",
});

const cubaoFreeNarrow = localFont({
  src: "fonts/Cubao_Free_Narrow.otf",
  variable: "--font-cubao-narrow",
  display: "swap",
});

const cubaoFreeWide = localFont({
  src: "fonts/Cubao_Free_Wide.otf",
  variable: "--font-cubao-wide",
  display: "swap",
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
		<TRPCProvider>
			<html lang="en">
				<body className={`${chakra.variable} ${nunito.variable} ${cubaoFree.variable} ${cubaoFreeNarrow.variable} ${cubaoFreeWide.variable}`}>
					{children}
				</body>
			</html>
		</TRPCProvider>
	);
}
