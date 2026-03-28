#!/usr/bin/env bun
/**
 * Create a Clerk JWT template named "convex" via the Clerk Backend API.
 *
 * Usage: bun run clerk-create-jwt.ts <clerk-secret-key>
 * Output: "created" | "already-exists" | error message
 */

const secretKey = process.argv[2];

if (!secretKey) {
	console.error("Usage: bun run clerk-create-jwt.ts <clerk-secret-key>");
	process.exit(2);
}

try {
	const res = await fetch("https://api.clerk.com/v1/jwt_templates", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${secretKey}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			name: "convex",
			claims: {},
			lifetime: 60,
			allowed_clock_skew: 5,
		}),
	});

	if (res.ok) {
		console.log("created");
		process.exit(0);
	}

	if (res.status === 422) {
		// Check if it's a "name already taken" error
		const body = await res.json() as { errors?: { code?: string; message?: string }[] };
		const errors = body.errors ?? [];
		const nameConflict = errors.some(
			(e) => e.code === "form_identifier_exists" || e.message?.includes("already")
		);
		if (nameConflict) {
			console.log("already-exists");
			process.exit(0);
		}
		console.error(`Error 422: ${JSON.stringify(body)}`);
		process.exit(1);
	}

	if (res.status === 401 || res.status === 403) {
		console.error("Error: Invalid or unauthorized Clerk secret key");
		process.exit(1);
	}

	const body = await res.text();
	console.error(`Error HTTP ${res.status}: ${body}`);
	process.exit(1);
} catch (e) {
	console.error(`Error: ${e instanceof Error ? e.message : e}`);
	process.exit(1);
}
