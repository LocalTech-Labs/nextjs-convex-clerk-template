import { defineRateLimits } from "convex-helpers/server/rateLimit";

/**
 * Rate limits for user-facing mutations.
 * Uses token-bucket algorithm — allows short bursts but enforces sustained rate.
 *
 * Configure per-mutation limits here, then call `rateLimit(ctx, { name, key })`
 * at the start of any mutation handler.
 *
 * Usage example: see `convex/users.ts` → `updateProfile` mutation.
 */
export const { rateLimit, checkRateLimit, resetRateLimit } = defineRateLimits({
	// General mutation rate limit: 10 requests per second, burst of 20
	mutation: {
		kind: "token bucket",
		rate: 10,
		period: 1000,
		capacity: 20,
	},
	// Stricter limit for write-heavy operations: 5 per second, burst of 10
	write: {
		kind: "token bucket",
		rate: 5,
		period: 1000,
		capacity: 10,
	},
});
