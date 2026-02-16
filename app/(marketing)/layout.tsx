import { Footer } from "@/components/marketing/footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { SaaSStructuredData } from "@/components/marketing/structured-data";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex min-h-screen flex-col">
			<SaaSStructuredData />
			<MarketingHeader />
			<main className="flex-1">{children}</main>
			<Footer />
		</div>
	);
}
