"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react";
import { Suspense, useEffect } from "react";

if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
	posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
		api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
		capture_pageview: false,
		capture_pageleave: true,
	});
}

function PostHogPageview() {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const posthogClient = usePostHog();

	useEffect(() => {
		if (pathname && posthogClient) {
			let url = window.origin + pathname;
			if (searchParams.toString()) {
				url = `${url}?${searchParams.toString()}`;
			}
			posthogClient.capture("$pageview", { $current_url: url });
		}
	}, [pathname, searchParams, posthogClient]);

	return null;
}

function PostHogIdentify() {
	const { isSignedIn } = useAuth();
	const { user } = useUser();
	const posthogClient = usePostHog();

	useEffect(() => {
		if (isSignedIn && user && posthogClient) {
			posthogClient.identify(user.id, {
				email: user.primaryEmailAddress?.emailAddress,
				name: user.fullName,
			});
		} else if (!isSignedIn && posthogClient) {
			posthogClient.reset();
		}
	}, [isSignedIn, user, posthogClient]);

	return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
	if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
		return <>{children}</>;
	}

	return (
		<PHProvider client={posthog}>
			<Suspense fallback={null}>
				<PostHogPageview />
			</Suspense>
			<PostHogIdentify />
			{children}
		</PHProvider>
	);
}
