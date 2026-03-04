import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/app/providers";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://yourapp.com"),
	title: {
		default: "YourApp - Launch Your SaaS Fast",
		template: "%s | YourApp",
	},
	description: "The fastest way to launch your micro-SaaS. Built with Next.js, Convex, and Clerk.",
	openGraph: {
		type: "website",
		locale: "en_US",
		siteName: "YourApp",
		images: [{ url: "/og-image.png", width: 1200, height: 630 }],
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
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
