import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/app/providers";
import { APP_DESCRIPTION, APP_NAME, APP_URL } from "@/lib/config";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	metadataBase: new URL(APP_URL),
	title: {
		default: `${APP_NAME} - Launch Your SaaS Fast`,
		template: `%s | ${APP_NAME}`,
	},
	description: APP_DESCRIPTION,
	openGraph: {
		type: "website",
		locale: "en_US",
		siteName: APP_NAME,
	},
	twitter: {
		card: "summary_large_image",
	},
	robots: {
		index: true,
		follow: true,
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
			<body>
				<a
					href="#main-content"
					className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-lg focus:ring-2 focus:ring-ring"
				>
					Skip to main content
				</a>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
