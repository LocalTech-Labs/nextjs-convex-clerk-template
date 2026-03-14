/**
 * Next.js 16 deprecates middleware.ts as the primary auth interception pattern.
 * Clerk's clerkMiddleware is still the recommended approach until Clerk ships
 * a non-middleware alternative. The deprecation warning is expected and safe to ignore.
 */
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
	"/",
	"/pricing",
	"/terms",
	"/privacy",
	"/changelog",
	"/sitemap.xml",
	"/robots.txt",
]);

export default clerkMiddleware(async (auth, req) => {
	if (!isPublicRoute(req)) {
		await auth.protect();
	}
});

export const config = {
	matcher: [
		// Skip Next.js internals and all static files, unless found in search params
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		// Always run for API routes
		"/(api|trpc)(.*)",
	],
};
