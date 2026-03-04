import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
	return (
		<div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
			<div className="text-6xl font-bold tracking-tighter text-muted-foreground/30">404</div>
			<div className="space-y-2">
				<h2 className="text-2xl font-bold tracking-tight">Page not found</h2>
				<p className="max-w-md text-muted-foreground">
					The page you&apos;re looking for doesn&apos;t exist or has been moved.
				</p>
			</div>
			<div className="flex gap-3">
				<Button asChild>
					<Link href="/">Go home</Link>
				</Button>
				<Button variant="outline" asChild>
					<Link href="/dashboard">Dashboard</Link>
				</Button>
			</div>
		</div>
	);
}
