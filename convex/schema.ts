import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	users: defineTable({
		name: v.string(),
		externalId: v.string(),
		plan: v.optional(v.union(v.literal("free"), v.literal("pro"))),
	}).index("byExternalId", ["externalId"]),
});
