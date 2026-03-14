import { APP_DESCRIPTION, APP_NAME } from "@/lib/config";

export function SaaSStructuredData() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "SoftwareApplication",
		name: APP_NAME,
		applicationCategory: "BusinessApplication",
		operatingSystem: "Web",
		description: APP_DESCRIPTION,
		offers: {
			"@type": "AggregateOffer",
			lowPrice: "0",
			highPrice: "9",
			priceCurrency: "USD",
			offerCount: "2",
		},
	};
	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
		/>
	);
}
