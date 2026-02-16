import type { Metadata } from "next";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
	title: "Terms of Service",
};

export default function TermsPage() {
	return (
		<div className="container mx-auto max-w-3xl px-4 py-16 md:py-24">
			<h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
			<p className="mt-2 text-muted-foreground">Last updated: February 15, 2026</p>

			<Separator className="my-8" />

			<div className="space-y-8">
				<section>
					<h2 className="text-2xl font-semibold tracking-tight">1. Introduction</h2>
					<p className="mt-3 leading-7 text-muted-foreground">
						Welcome to [YourApp]. These Terms of Service (&quot;Terms&quot;) govern your access to
						and use of the [YourApp] website, applications, and services (collectively, the
						&quot;Service&quot;) operated by [Your Company] (&quot;we&quot;, &quot;us&quot;, or
						&quot;our&quot;). By accessing or using our Service, you agree to be bound by these
						Terms.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold tracking-tight">2. Acceptance of Terms</h2>
					<p className="mt-3 leading-7 text-muted-foreground">
						By creating an account or using the Service, you acknowledge that you have read,
						understood, and agree to be bound by these Terms and our Privacy Policy. If you do not
						agree to these Terms, you may not use the Service. You must be at least 18 years old or
						have the consent of a parent or legal guardian to use the Service.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold tracking-tight">3. Account Terms</h2>
					<div className="mt-3 space-y-3 leading-7 text-muted-foreground">
						<p>
							You are responsible for maintaining the security of your account and password. [Your
							Company] cannot and will not be liable for any loss or damage from your failure to
							comply with this security obligation.
						</p>
						<ul className="list-disc space-y-2 pl-6">
							<li>
								You must provide accurate and complete information when creating your account.
							</li>
							<li>You are responsible for all activity that occurs under your account.</li>
							<li>You must notify us immediately of any unauthorized use of your account.</li>
							<li>You may not use the Service for any illegal or unauthorized purpose.</li>
						</ul>
					</div>
				</section>

				<section>
					<h2 className="text-2xl font-semibold tracking-tight">4. Payment Terms</h2>
					<div className="mt-3 space-y-3 leading-7 text-muted-foreground">
						<p>
							Paid features of the Service are billed in advance on a monthly or annual basis and
							are non-refundable. There will be no refunds or credits for partial months of service,
							upgrade/downgrade refunds, or refunds for months unused with an open account.
						</p>
						<ul className="list-disc space-y-2 pl-6">
							<li>
								All fees are exclusive of applicable taxes, which you are responsible for paying.
							</li>
							<li>
								Prices may change with 30 days&apos; notice. Continued use after a price change
								constitutes acceptance.
							</li>
							<li>
								Downgrading your plan may cause loss of access to features or capacity. We are not
								liable for such loss.
							</li>
						</ul>
					</div>
				</section>

				<section>
					<h2 className="text-2xl font-semibold tracking-tight">5. Intellectual Property</h2>
					<p className="mt-3 leading-7 text-muted-foreground">
						The Service and its original content, features, and functionality are and will remain
						the exclusive property of [Your Company] and its licensors. The Service is protected by
						copyright, trademark, and other laws. Our trademarks may not be used in connection with
						any product or service without the prior written consent of [Your Company].
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold tracking-tight">6. User Content</h2>
					<div className="mt-3 space-y-3 leading-7 text-muted-foreground">
						<p>
							You retain ownership of any content you submit, post, or display on or through the
							Service (&quot;User Content&quot;). By submitting User Content, you grant us a
							worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and
							distribute your User Content solely for the purpose of operating and improving the
							Service.
						</p>
						<p>
							You represent and warrant that you own or have the necessary rights to your User
							Content and that it does not violate any third party&apos;s rights.
						</p>
					</div>
				</section>

				<section>
					<h2 className="text-2xl font-semibold tracking-tight">7. Prohibited Uses</h2>
					<p className="mt-3 leading-7 text-muted-foreground">
						You agree not to use the Service to:
					</p>
					<ul className="mt-3 list-disc space-y-2 pl-6 leading-7 text-muted-foreground">
						<li>Violate any applicable laws or regulations.</li>
						<li>Infringe upon the rights of others.</li>
						<li>
							Transmit any harmful, threatening, abusive, or otherwise objectionable material.
						</li>
						<li>Attempt to gain unauthorized access to any part of the Service.</li>
						<li>Interfere with or disrupt the integrity or performance of the Service.</li>
						<li>
							Use the Service to send unsolicited communications (spam) or for any fraudulent
							purpose.
						</li>
						<li>Reverse engineer, decompile, or disassemble any aspect of the Service.</li>
					</ul>
				</section>

				<section>
					<h2 className="text-2xl font-semibold tracking-tight">8. Limitation of Liability</h2>
					<div className="mt-3 space-y-3 leading-7 text-muted-foreground">
						<p>
							To the maximum extent permitted by law, [Your Company] shall not be liable for any
							indirect, incidental, special, consequential, or punitive damages, or any loss of
							profits or revenues, whether incurred directly or indirectly, or any loss of data,
							use, goodwill, or other intangible losses.
						</p>
						<p>
							In no event shall our aggregate liability exceed the greater of one hundred dollars
							($100) or the amount you paid us in the twelve (12) months preceding the claim.
						</p>
					</div>
				</section>

				<section>
					<h2 className="text-2xl font-semibold tracking-tight">9. Termination</h2>
					<p className="mt-3 leading-7 text-muted-foreground">
						We may terminate or suspend your account and access to the Service immediately, without
						prior notice or liability, for any reason, including if you breach these Terms. Upon
						termination, your right to use the Service will immediately cease. All provisions of
						these Terms which by their nature should survive termination shall survive, including
						ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold tracking-tight">10. Changes to Terms</h2>
					<p className="mt-3 leading-7 text-muted-foreground">
						We reserve the right to modify or replace these Terms at any time. If a revision is
						material, we will provide at least 30 days&apos; notice prior to any new terms taking
						effect. What constitutes a material change will be determined at our sole discretion. By
						continuing to access or use the Service after any revisions become effective, you agree
						to be bound by the revised terms.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold tracking-tight">11. Contact</h2>
					<p className="mt-3 leading-7 text-muted-foreground">
						If you have any questions about these Terms, please contact us at{" "}
						<span className="font-medium text-foreground">support@[yourapp].com</span>.
					</p>
				</section>
			</div>
		</div>
	);
}
