"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
			<div className="text-6xl font-bold tracking-tighter text-muted-foreground/30">500</div>
			<div className="space-y-2">
				<h2 className="text-2xl font-bold tracking-tight">Something went wrong</h2>
				<p className="max-w-md text-muted-foreground">
					{error.message || "An unexpected error occurred. Please try again."}
				</p>
			</div>
			<div className="flex gap-3">
				<Button onClick={reset}>Try again</Button>
				<Button variant="outline" asChild>
					<Link href="/">Go home</Link>
				</Button>
			</div>
		</div>
	);
}
