"use client";

import { useQuery } from "convex/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";

export default function DashboardPage() {
	const user = useQuery(api.users.current);
	const planData = useQuery(api.subscriptions.currentPlan);

	if (user === undefined) {
		return <DashboardSkeleton />;
	}

	const planName = planData?.plan === "pro" ? "Pro" : "Free";
	const isPro = planData?.isPro ?? false;

	return (
		<div className="container mx-auto max-w-screen-xl px-4 py-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold tracking-tight">
					Welcome back{user?.name ? `, ${user.name}` : ""}
				</h1>
				<p className="text-muted-foreground">Here&apos;s an overview of your account.</p>
			</div>

			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				<Card>
					<CardHeader>
						<CardDescription>Current Plan</CardDescription>
						<CardTitle className="text-2xl">{planName}</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-muted-foreground mb-4">
							{isPro
								? "You have full access to all features."
								: "Upgrade to Pro for unlimited access."}
						</p>
						<Button size="sm" asChild>
							<Link href="/settings">{isPro ? "Manage Plan" : "Upgrade"}</Link>
						</Button>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardDescription>Usage</CardDescription>
						<CardTitle className="text-2xl">{isPro ? "Unlimited" : "0 / 100"}</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-muted-foreground">Items used this month.</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardDescription>Quick Actions</CardDescription>
						<CardTitle className="text-2xl">Get Started</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-muted-foreground mb-4">Start building your first project.</p>
						<Button size="sm" variant="outline">
							Create New
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

function DashboardSkeleton() {
	return (
		<div className="container mx-auto max-w-screen-xl px-4 py-8">
			<div className="mb-8">
				<Skeleton className="h-9 w-64" />
				<Skeleton className="mt-2 h-5 w-48" />
			</div>
			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{[1, 2, 3].map((i) => (
					<Card key={i}>
						<CardHeader>
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-8 w-16" />
						</CardHeader>
						<CardContent>
							<Skeleton className="h-4 w-full" />
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
