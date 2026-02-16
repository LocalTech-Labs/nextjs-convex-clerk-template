import Link from "next/link";

export function Footer() {
	return (
		<footer className="border-t border-border/40 bg-background">
			<div className="container mx-auto max-w-screen-xl px-4 py-12">
				<div className="grid grid-cols-2 gap-8 md:grid-cols-4">
					<div>
						<h3 className="font-semibold text-sm">Product</h3>
						<ul className="mt-3 space-y-2 text-sm text-muted-foreground">
							<li>
								<Link href="/#features" className="hover:text-foreground">
									Features
								</Link>
							</li>
							<li>
								<Link href="/pricing" className="hover:text-foreground">
									Pricing
								</Link>
							</li>
							<li>
								<Link href="/changelog" className="hover:text-foreground">
									Changelog
								</Link>
							</li>
						</ul>
					</div>
					<div>
						<h3 className="font-semibold text-sm">Company</h3>
						<ul className="mt-3 space-y-2 text-sm text-muted-foreground">
							<li>
								<Link href="/terms" className="hover:text-foreground">
									Terms of Service
								</Link>
							</li>
							<li>
								<Link href="/privacy" className="hover:text-foreground">
									Privacy Policy
								</Link>
							</li>
						</ul>
					</div>
					<div>
						<h3 className="font-semibold text-sm">Support</h3>
						<ul className="mt-3 space-y-2 text-sm text-muted-foreground">
							<li>
								<a href="mailto:support@yourapp.com" className="hover:text-foreground">
									Contact
								</a>
							</li>
						</ul>
					</div>
					<div>
						<h3 className="font-semibold text-sm">Connect</h3>
						<ul className="mt-3 space-y-2 text-sm text-muted-foreground">
							<li>
								<a
									href="https://twitter.com/yourapp"
									target="_blank"
									rel="noopener noreferrer"
									className="hover:text-foreground"
								>
									Twitter
								</a>
							</li>
							<li>
								<a
									href="https://github.com/yourapp"
									target="_blank"
									rel="noopener noreferrer"
									className="hover:text-foreground"
								>
									GitHub
								</a>
							</li>
						</ul>
					</div>
				</div>
				<div className="mt-8 border-t border-border/40 pt-8 text-center text-sm text-muted-foreground">
					<p>&copy; {new Date().getFullYear()} YourApp. All rights reserved.</p>
				</div>
			</div>
		</footer>
	);
}
