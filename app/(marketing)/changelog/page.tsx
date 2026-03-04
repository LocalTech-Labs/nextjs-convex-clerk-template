import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
	title: "Changelog",
};

const CHANGELOG_ENTRIES = [
	{
		version: "1.2.0",
		date: "February 10, 2026",
		title: "Analytics Dashboard & API Improvements",
		changes: [
			"Added advanced analytics dashboard with custom date ranges and filters.",
			"Introduced webhook integrations for Pro users.",
			"Improved API rate limiting with clearer error messages.",
			"Fixed an issue where CSV exports could timeout on large datasets.",
			"Updated dependencies to latest stable versions.",
		],
	},
	{
		version: "1.1.0",
		date: "January 15, 2026",
		title: "Custom Domains & Performance",
		changes: [
			"Added custom domain support for Pro plan users.",
			"Reduced initial page load time by 40% with optimized bundling.",
			"Added JSON export option alongside existing CSV export.",
			"Improved real-time sync reliability for concurrent users.",
			"Fixed a bug where notifications could be sent multiple times.",
		],
	},
	{
		version: "1.0.1",
		date: "December 20, 2025",
		title: "Bug Fixes & Polish",
		changes: [
			"Fixed authentication redirect loop on certain browsers.",
			"Improved mobile responsiveness across all pages.",
			"Added email notification preferences to account settings.",
			"Fixed dark mode contrast issues in the data table component.",
		],
	},
	{
		version: "1.0.0",
		date: "December 1, 2025",
		title: "Initial Release",
		changes: [
			"Launched [YourApp] with Free and Pro plans.",
			"Authentication powered by Clerk with social login support.",
			"Real-time database with Convex for instant data synchronization.",
			"Product analytics integration with PostHog.",
			"Deployed globally on Cloudflare Workers for fast performance.",
		],
	},
];

export default function ChangelogPage() {
	return (
		<div className="container mx-auto max-w-3xl px-4 py-16 md:py-24">
			<h1 className="text-4xl font-bold tracking-tight">Changelog</h1>
			<p className="mt-2 text-muted-foreground">All notable changes and updates to [YourApp].</p>

			<Separator className="my-8" />

			<div className="space-y-12">
				{CHANGELOG_ENTRIES.map((entry, index) => (
					<div key={entry.version} className="relative">
						{index < CHANGELOG_ENTRIES.length - 1 && (
							<div className="absolute top-10 bottom-0 left-[7px] w-px bg-border" />
						)}
						<div className="flex items-center gap-3">
							<div className="size-[15px] shrink-0 rounded-full border-2 border-primary bg-background" />
							<Badge variant="secondary">{entry.version}</Badge>
							<span className="text-sm text-muted-foreground">{entry.date}</span>
						</div>
						<div className="ml-8 mt-3">
							<h2 className="text-xl font-semibold tracking-tight">{entry.title}</h2>
							<ul className="mt-3 space-y-2">
								{entry.changes.map((change) => (
									<li
										key={change}
										className="flex items-start gap-2 text-sm leading-6 text-muted-foreground"
									>
										<span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
										{change}
									</li>
								))}
							</ul>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
