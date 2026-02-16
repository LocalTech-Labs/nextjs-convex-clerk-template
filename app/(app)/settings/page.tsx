"use client";

import { PricingTable } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";

export default function SettingsPage() {
	const user = useQuery(api.users.current);

	if (user === undefined) {
		return <SettingsSkeleton />;
	}

	return (
		<div className="container mx-auto max-w-screen-xl px-4 py-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold tracking-tight">Settings</h1>
				<p className="text-muted-foreground">Manage your account and subscription.</p>
			</div>

			<div className="grid gap-6 max-w-2xl">
				<Card>
					<CardHeader>
						<CardTitle>Profile</CardTitle>
						<CardDescription>Your account information is managed by Clerk.</CardDescription>
					</CardHeader>
					<CardContent className="space-y-2">
						<div>
							<span className="text-sm text-muted-foreground">Name: </span>
							<span className="text-sm">{user?.name || "Not set"}</span>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Subscription</CardTitle>
						<CardDescription>Manage your plan and billing.</CardDescription>
					</CardHeader>
					<CardContent>
						<PricingTable />
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

function SettingsSkeleton() {
	return (
		<div className="container mx-auto max-w-screen-xl px-4 py-8">
			<div className="mb-8">
				<Skeleton className="h-9 w-32" />
				<Skeleton className="mt-2 h-5 w-64" />
			</div>
			<div className="grid gap-6 max-w-2xl">
				<Card>
					<CardHeader>
						<Skeleton className="h-6 w-24" />
						<Skeleton className="h-4 w-48" />
					</CardHeader>
					<CardContent>
						<Skeleton className="h-4 w-full" />
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
