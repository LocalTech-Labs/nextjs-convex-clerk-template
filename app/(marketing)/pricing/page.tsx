import type { Metadata } from "next";
import { Separator } from "@/components/ui/separator";
import { ClerkPricingTable } from "./clerk-pricing-table";
import { PricingFAQ } from "./pricing-faq";

export const metadata: Metadata = {
	title: "Pricing",
};

export default function PricingPage() {
	return (
		<div className="flex flex-col">
			{/* Header */}
			<section className="container mx-auto flex max-w-screen-xl flex-col items-center gap-4 px-4 py-16 text-center md:py-24">
				<h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
					Simple, transparent pricing
				</h1>
				<p className="max-w-xl text-lg text-muted-foreground">
					Start free with everything you need. Upgrade to Pro when you&apos;re ready for more power
					and flexibility.
				</p>
			</section>

			{/* Pricing Table */}
			<section className="container mx-auto max-w-screen-xl px-4 pb-16">
				<div className="mx-auto max-w-4xl">
					<ClerkPricingTable />
				</div>
			</section>

			<Separator />

			{/* FAQ Section */}
			<section className="container mx-auto max-w-screen-xl px-4 py-16 md:py-24">
				<div className="mx-auto max-w-2xl">
					<h2 className="text-center text-3xl font-bold tracking-tight">
						Frequently Asked Questions
					</h2>
					<p className="mt-4 text-center text-muted-foreground">
						Everything you need to know about our pricing.
					</p>
					<div className="mt-10">
						<PricingFAQ />
					</div>
				</div>
			</section>
		</div>
	);
}
