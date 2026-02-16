import type { Metadata } from "next";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
	title: "Privacy Policy",
};

export default function PrivacyPage() {
	return (
		<div className="container mx-auto max-w-3xl px-4 py-16 md:py-24">
			<h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
			<p className="mt-2 text-muted-foreground">Last updated: February 15, 2026</p>

			<Separator className="my-8" />

			<div className="space-y-8">
				<section>
					<h2 className="text-2xl font-semibold tracking-tight">1. Introduction</h2>
					<p className="mt-3 leading-7 text-muted-foreground">
						[Your Company] (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates [YourApp]
						(the &quot;Service&quot;). This Privacy Policy explains how we collect, use, disclose,
						and safeguard your information when you use our Service. Please read this policy
						carefully. If you do not agree with the terms of this Privacy Policy, please do not use
						the Service.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold tracking-tight">2. Information We Collect</h2>
					<div className="mt-3 space-y-3 leading-7 text-muted-foreground">
						<p>We may collect the following types of information:</p>
						<ul className="list-disc space-y-2 pl-6">
							<li>
								<span className="font-medium text-foreground">Personal Information:</span> Name,
								email address, and billing information provided when you create an account or make a
								purchase.
							</li>
							<li>
								<span className="font-medium text-foreground">Usage Data:</span> Information about
								how you interact with the Service, including pages visited, features used, and
								actions taken.
							</li>
							<li>
								<span className="font-medium text-foreground">Device Data:</span> Browser type,
								operating system, IP address, and device identifiers.
							</li>
							<li>
								<span className="font-medium text-foreground">Cookies and Tracking:</span> Data
								collected through cookies, pixels, and similar technologies.
							</li>
						</ul>
					</div>
				</section>

				<section>
					<h2 className="text-2xl font-semibold tracking-tight">3. How We Use Information</h2>
					<div className="mt-3 space-y-3 leading-7 text-muted-foreground">
						<p>We use the information we collect to:</p>
						<ul className="list-disc space-y-2 pl-6">
							<li>Provide, operate, and maintain the Service.</li>
							<li>Process transactions and send related information.</li>
							<li>Send you technical notices, updates, security alerts, and support messages.</li>
							<li>Respond to your comments, questions, and customer service requests.</li>
							<li>Monitor and analyze trends, usage, and activities to improve the Service.</li>
							<li>
								Detect, investigate, and prevent fraudulent transactions and other illegal
								activities.
							</li>
						</ul>
					</div>
				</section>

				<section>
					<h2 className="text-2xl font-semibold tracking-tight">4. Information Sharing</h2>
					<div className="mt-3 space-y-3 leading-7 text-muted-foreground">
						<p>
							We do not sell your personal information. We may share your information in the
							following situations:
						</p>
						<ul className="list-disc space-y-2 pl-6">
							<li>
								<span className="font-medium text-foreground">Service Providers:</span> With
								third-party vendors who perform services on our behalf (e.g., payment processing,
								analytics, email delivery).
							</li>
							<li>
								<span className="font-medium text-foreground">Legal Requirements:</span> When
								required by law, regulation, or legal process.
							</li>
							<li>
								<span className="font-medium text-foreground">Business Transfers:</span> In
								connection with a merger, acquisition, or sale of assets.
							</li>
							<li>
								<span className="font-medium text-foreground">With Consent:</span> When you have
								given us explicit consent to share your information.
							</li>
						</ul>
					</div>
				</section>

				<section>
					<h2 className="text-2xl font-semibold tracking-tight">5. Data Security</h2>
					<p className="mt-3 leading-7 text-muted-foreground">
						We implement appropriate technical and organizational security measures to protect your
						personal information against unauthorized access, alteration, disclosure, or
						destruction. However, no method of transmission over the Internet or electronic storage
						is 100% secure, and we cannot guarantee absolute security.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold tracking-tight">
						6. Cookies and Tracking Technologies
					</h2>
					<div className="mt-3 space-y-3 leading-7 text-muted-foreground">
						<p>
							We use cookies and similar tracking technologies to collect and track information and
							to improve the Service. You can instruct your browser to refuse all cookies or to
							indicate when a cookie is being sent.
						</p>
						<ul className="list-disc space-y-2 pl-6">
							<li>
								<span className="font-medium text-foreground">Essential Cookies:</span> Required for
								the Service to function properly (e.g., authentication).
							</li>
							<li>
								<span className="font-medium text-foreground">Analytics Cookies:</span> Help us
								understand how visitors interact with the Service.
							</li>
							<li>
								<span className="font-medium text-foreground">Preference Cookies:</span> Remember
								your settings and preferences.
							</li>
						</ul>
					</div>
				</section>

				<section>
					<h2 className="text-2xl font-semibold tracking-tight">7. Your Rights</h2>
					<div className="mt-3 space-y-3 leading-7 text-muted-foreground">
						<p>
							Depending on your location, you may have the following rights regarding your personal
							information:
						</p>
						<ul className="list-disc space-y-2 pl-6">
							<li>
								<span className="font-medium text-foreground">Access:</span> Request a copy of the
								personal information we hold about you.
							</li>
							<li>
								<span className="font-medium text-foreground">Correction:</span> Request correction
								of inaccurate or incomplete information.
							</li>
							<li>
								<span className="font-medium text-foreground">Deletion:</span> Request deletion of
								your personal information.
							</li>
							<li>
								<span className="font-medium text-foreground">Portability:</span> Request a copy of
								your data in a structured, machine-readable format.
							</li>
							<li>
								<span className="font-medium text-foreground">Opt-Out:</span> Opt out of marketing
								communications at any time.
							</li>
						</ul>
						<p>
							To exercise any of these rights, please contact us at{" "}
							<span className="font-medium text-foreground">privacy@[yourapp].com</span>.
						</p>
					</div>
				</section>

				<section>
					<h2 className="text-2xl font-semibold tracking-tight">8. Children&apos;s Privacy</h2>
					<p className="mt-3 leading-7 text-muted-foreground">
						The Service is not intended for use by anyone under the age of 13. We do not knowingly
						collect personal information from children under 13. If we become aware that we have
						collected personal information from a child under 13, we will take steps to delete such
						information.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold tracking-tight">9. Changes to This Policy</h2>
					<p className="mt-3 leading-7 text-muted-foreground">
						We may update this Privacy Policy from time to time. We will notify you of any changes
						by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot;
						date. You are advised to review this Privacy Policy periodically for any changes.
						Changes are effective when they are posted on this page.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold tracking-tight">10. Contact</h2>
					<p className="mt-3 leading-7 text-muted-foreground">
						If you have any questions about this Privacy Policy, please contact us at{" "}
						<span className="font-medium text-foreground">privacy@[yourapp].com</span>.
					</p>
				</section>
			</div>
		</div>
	);
}
