"use client";

import { SignInButton, UserButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated } from "convex/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/config";

export default function Header() {
	return (
		<header className="bg-background sticky top-0 z-50 w-full border-b border-border/40 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-14 max-w-screen-2xl items-center">
				<Link href="/dashboard" className="mr-6 flex items-center space-x-2">
					<span className="font-bold sm:inline-block">{APP_NAME}</span>
				</Link>
				<nav className="flex flex-1 items-center gap-6 text-sm">
					<Link
						href="/dashboard"
						className="text-muted-foreground hover:text-foreground transition-colors"
					>
						Dashboard
					</Link>
					<Link
						href="/settings"
						className="text-muted-foreground hover:text-foreground transition-colors"
					>
						Settings
					</Link>
				</nav>
				<div className="flex items-center space-x-4">
					<Authenticated>
						<UserButton afterSignOutUrl="/" />
					</Authenticated>
					<Unauthenticated>
						<SignInButton mode="modal">
							<Button variant="outline" size="sm">
								Sign In
							</Button>
						</SignInButton>
					</Unauthenticated>
				</div>
			</div>
		</header>
	);
}
