export function SaaSStructuredData() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "SoftwareApplication",
		name: "YourApp",
		applicationCategory: "BusinessApplication",
		operatingSystem: "Web",
		description: "The fastest way to launch your micro-SaaS.",
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
