import type { QueryCtx } from "./_generated/server";
import { query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const currentPlan = query({
	args: {},
	handler: async (ctx) => {
		const user = await getCurrentUser(ctx);
		if (!user) return null;

		return {
			plan: user.plan ?? "free",
			isPro: user.plan === "pro",
		};
	},
});

export const isPro = query({
	args: {},
	handler: async (ctx) => {
		const user = await getCurrentUser(ctx);
		if (!user) return false;

		return user.plan === "pro";
	},
});

export async function requirePro(ctx: QueryCtx) {
	const user = await getCurrentUser(ctx);
	if (!user) throw new Error("Not authenticated");

	if (user.plan !== "pro") {
		throw new Error("Pro plan required");
	}

	return user;
}
