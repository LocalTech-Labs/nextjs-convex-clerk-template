import type { UserJSON } from "@clerk/backend";
import type { Validator } from "convex/values";
import { v } from "convex/values";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { internalMutation, query } from "./_generated/server";

export const current = query({
	args: {},
	handler: async (ctx) => {
		return await getCurrentUser(ctx);
	},
});

export const upsertFromClerk = internalMutation({
	args: { data: v.any() as Validator<UserJSON> },
	async handler(ctx, { data }) {
		const plan = (data.public_metadata as Record<string, unknown>)?.plan as string | undefined;
		const userAttributes = {
			name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
			externalId: data.id,
			...(plan === "free" || plan === "pro" ? { plan } : {}),
		};

		const user = await userByExternalId(ctx, data.id);
		if (user === null) {
			await ctx.db.insert("users", userAttributes);
		} else {
			await ctx.db.patch(user._id, userAttributes);
		}
	},
});

export const deleteFromClerk = internalMutation({
	args: { clerkUserId: v.string() },
	async handler(ctx, { clerkUserId }) {
		const user = await userByExternalId(ctx, clerkUserId);
		if (user !== null) {
			await ctx.db.delete(user._id);
		} else {
			console.warn(`Can't delete user, none found for Clerk ID: ${clerkUserId}`);
		}
	},
});

export async function getCurrentUserOrThrow(ctx: QueryCtx | MutationCtx) {
	const userRecord = await getCurrentUser(ctx);
	if (!userRecord) throw new Error("Can't get current user");
	return userRecord;
}

export async function getCurrentUser(ctx: QueryCtx | MutationCtx) {
	const identity = await ctx.auth.getUserIdentity();
	if (identity === null) {
		return null;
	}
	return await userByExternalId(ctx, identity.subject);
}

async function userByExternalId(ctx: QueryCtx | MutationCtx, externalId: string) {
	return await ctx.db
		.query("users")
		.withIndex("byExternalId", (q) => q.eq("externalId", externalId))
		.unique();
}
