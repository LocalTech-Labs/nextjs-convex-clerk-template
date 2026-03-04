import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PLAN_FEATURES, PLANS } from "@/convex/lib/constants";

export const metadata: Metadata = {
	title: "Launch Your SaaS Fast",
	description:
		"Everything you need to launch your micro-SaaS. Authentication, payments, database, analytics, and deployment — all pre-configured.",
	openGraph: {
		title: "YourApp - Launch Your SaaS Fast",
		description:
			"Everything you need to launch your micro-SaaS. Authentication, payments, database, analytics, and deployment — all pre-configured.",
	},
};

export default function HomePage() {
	return (
		<div className="flex flex-col">
			{/* Hero Section */}
			<section className="container mx-auto flex max-w-screen-xl flex-col items-center gap-6 px-4 py-24 text-center md:py-32">
				<div className="rounded-full border border-border/60 bg-muted px-4 py-1.5 text-sm text-muted-foreground">
					Now in public beta
				</div>
				<h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
					Ship your SaaS <span className="text-primary">in record time</span>
				</h1>
				<p className="max-w-xl text-lg text-muted-foreground">
					Everything you need to launch your micro-SaaS. Authentication, payments, database,
					analytics, and deployment — all pre-configured.
				</p>
				<div className="flex gap-3">
					<Button size="lg" asChild>
						<Link href="/dashboard">Get Started Free</Link>
					</Button>
					<Button size="lg" variant="outline" asChild>
						<Link href="/pricing">View Pricing</Link>
					</Button>
				</div>
			</section>

			{/* Features Section */}
			<section id="features" className="border-t bg-muted/30 py-24">
				<div className="container mx-auto max-w-screen-xl px-4">
					<div className="mx-auto max-w-2xl text-center">
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Everything you need to launch
						</h2>
						<p className="mt-4 text-muted-foreground">
							Stop rebuilding the same infrastructure. Start with a production-ready foundation.
						</p>
					</div>
					<div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
						{FEATURES.map((feature) => (
							<div key={feature.title} className="rounded-lg border bg-card p-6 shadow-sm">
								<div className="mb-3 text-2xl">{feature.icon}</div>
								<h3 className="font-semibold">{feature.title}</h3>
								<p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Pricing Section */}
			<section id="pricing" className="py-24">
				<div className="container mx-auto max-w-screen-xl px-4">
					<div className="mx-auto max-w-2xl text-center">
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Simple, transparent pricing
						</h2>
						<p className="mt-4 text-muted-foreground">Start free, upgrade when you need more.</p>
					</div>
					<div className="mx-auto mt-16 grid max-w-4xl gap-8 md:grid-cols-2">
						{PRICING.map((plan) => (
							<div
								key={plan.name}
								className={`rounded-lg border p-8 ${plan.featured ? "border-primary shadow-lg ring-1 ring-primary" : "bg-card shadow-sm"}`}
							>
								<h3 className="font-semibold text-lg">{plan.name}</h3>
								<p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
								<div className="mt-4">
									<span className="text-4xl font-bold">{plan.price}</span>
									{plan.period && <span className="text-muted-foreground">/{plan.period}</span>}
								</div>
								<ul className="mt-6 space-y-3 text-sm">
									{plan.features.map((feature) => (
										<li key={feature} className="flex items-center gap-2">
											<span className="text-primary">&#10003;</span>
											{feature}
										</li>
									))}
								</ul>
								<Button
									className="mt-8 w-full"
									variant={plan.featured ? "default" : "outline"}
									asChild
								>
									<Link href="/pricing">{plan.cta}</Link>
								</Button>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="border-t bg-muted/30 py-24">
				<div className="container mx-auto max-w-screen-xl px-4 text-center">
					<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
						Ready to launch your SaaS?
					</h2>
					<p className="mx-auto mt-4 max-w-xl text-muted-foreground">
						Join hundreds of makers who ship faster with YourApp.
					</p>
					<Button size="lg" className="mt-8" asChild>
						<Link href="/dashboard">Start Building Free</Link>
					</Button>
				</div>
			</section>
		</div>
	);
}

const FEATURES = [
	{
		icon: "🔐",
		title: "Authentication",
		description:
			"Clerk-powered auth with social logins, email/password, and SSO. User management built in.",
	},
	{
		icon: "💳",
		title: "Built-in Billing",
		description: "Subscription billing with Clerk Billing. Free and Pro tiers with feature gating.",
	},
	{
		icon: "⚡",
		title: "Real-time Database",
		description:
			"Convex serverless backend with real-time queries, mutations, and automatic caching.",
	},
	{
		icon: "📊",
		title: "Analytics",
		description: "PostHog integration for product analytics, feature flags, and user tracking.",
	},
	{
		icon: "🎨",
		title: "Beautiful UI",
		description:
			"46 shadcn/ui components with Tailwind CSS v4. Dark mode and responsive design included.",
	},
	{
		icon: "🚀",
		title: "Edge Deployment",
		description: "Deploy globally on Cloudflare Workers. Fast cold starts and automatic scaling.",
	},
];

const PRICING = [
	{
		name: PLANS.free.name,
		description: "Perfect for getting started",
		price: "$0",
		period: null,
		featured: false,
		cta: "Get Started",
		features: PLAN_FEATURES.map((f) => `${f.name}: ${f.free}`),
	},
	{
		name: PLANS.pro.name,
		description: "For serious makers",
		price: "$9",
		period: "month",
		featured: true,
		cta: "Upgrade to Pro",
		features: PLAN_FEATURES.map((f) => `${f.name}: ${f.pro}`),
	},
];
