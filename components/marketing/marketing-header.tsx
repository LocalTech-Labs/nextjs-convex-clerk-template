"use client";

import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated } from "convex/react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/config";

export function MarketingHeader() {
	return (
		<header className="bg-background/80 sticky top-0 z-50 w-full border-b border-border/40 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-14 max-w-screen-xl items-center">
				<Link href="/" className="mr-6 flex items-center space-x-2">
					<Image
						src="/next.svg"
						alt={`${APP_NAME} logo`}
						width={24}
						height={24}
						className="dark:invert"
					/>
					<span className="font-bold text-lg">{APP_NAME}</span>
				</Link>
				<nav className="flex flex-1 items-center gap-6 text-sm">
					<Link
						href="/#features"
						className="text-muted-foreground hover:text-foreground transition-colors"
					>
						Features
					</Link>
					<Link
						href="/pricing"
						className="text-muted-foreground hover:text-foreground transition-colors"
					>
						Pricing
					</Link>
					<Link
						href="/changelog"
						className="text-muted-foreground hover:text-foreground transition-colors"
					>
						Changelog
					</Link>
				</nav>
				<div className="flex items-center gap-2">
					<Authenticated>
						<Button asChild size="sm">
							<Link href="/dashboard">Dashboard</Link>
						</Button>
					</Authenticated>
					<Unauthenticated>
						<SignInButton mode="modal">
							<Button variant="ghost" size="sm">
								Sign In
							</Button>
						</SignInButton>
						<SignUpButton mode="modal">
							<Button size="sm">Get Started</Button>
						</SignUpButton>
					</Unauthenticated>
				</div>
			</div>
		</header>
	);
}
