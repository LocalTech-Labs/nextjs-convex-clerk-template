"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ_ITEMS = [
	{
		question: "Is the Free plan really free?",
		answer:
			"Yes! The Free plan is completely free with no credit card required. It includes up to 100 items, basic analytics, and community support. You can use it for as long as you want.",
	},
	{
		question: "Can I upgrade or downgrade at any time?",
		answer:
			"Absolutely. You can upgrade to Pro at any time, and your new features will be available immediately. If you downgrade, you will retain Pro features until the end of your current billing period.",
	},
	{
		question: "What payment methods do you accept?",
		answer:
			"We accept all major credit cards (Visa, Mastercard, American Express) through our secure payment processor, Stripe. All transactions are encrypted and PCI-compliant.",
	},
	{
		question: "Is there an annual billing option?",
		answer:
			"Yes, we offer annual billing at a discounted rate. When you choose annual billing, you get two months free compared to monthly billing. Contact us for details.",
	},
	{
		question: "What happens if I exceed the Free plan limits?",
		answer:
			"If you reach the 100-item limit on the Free plan, you will need to upgrade to Pro to add more items. Your existing data is never deleted, and you can upgrade seamlessly at any time.",
	},
	{
		question: "Do you offer refunds?",
		answer:
			"We offer a 14-day money-back guarantee on Pro subscriptions. If you are not satisfied within the first 14 days, contact our support team for a full refund.",
	},
];

export function PricingFAQ() {
	return (
		<Accordion type="single" collapsible className="w-full">
			{FAQ_ITEMS.map((item, index) => (
				<AccordionItem key={item.question} value={`item-${index}`}>
					<AccordionTrigger>{item.question}</AccordionTrigger>
					<AccordionContent>{item.answer}</AccordionContent>
				</AccordionItem>
			))}
		</Accordion>
	);
}
