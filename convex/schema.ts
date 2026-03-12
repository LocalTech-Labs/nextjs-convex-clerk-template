import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { rateLimitTables } from "convex-helpers/server/rateLimit";

export default defineSchema({
	...rateLimitTables,
	users: defineTable({
		name: v.string(),
		externalId: v.string(),
		plan: v.optional(v.union(v.literal("free"), v.literal("pro"))),
	}).index("byExternalId", ["externalId"]),

	// --- Generated tables below ---
});
