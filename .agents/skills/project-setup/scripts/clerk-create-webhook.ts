#!/usr/bin/env bun
/**
 * Create a Clerk webhook endpoint for Convex user sync.
 *
 * Usage: bun run clerk-create-webhook.ts <clerk-secret-key> <webhook-url>
 * Output on success: the signing secret (whsec_...)
 * Exit 0 on success, 1 on error.
 */

const secretKey = process.argv[2];
const webhookUrl = process.argv[3];

if (!secretKey || !webhookUrl) {
	console.error("Usage: bun run clerk-create-webhook.ts <clerk-secret-key> <webhook-url>");
	process.exit(2);
}

try {
	// First, check if a webhook for this URL already exists
	const listRes = await fetch("https://api.clerk.com/v1/webhooks", {
		headers: {
			Authorization: `Bearer ${secretKey}`,
		},
	});

	if (listRes.ok) {
		const existing = (await listRes.json()) as { data?: { url?: string; id?: string }[] };
		const webhooks = existing.data ?? (Array.isArray(existing) ? existing : []);
		const match = webhooks.find(
			(w: { url?: string }) => w.url === webhookUrl
		);
		if (match) {
			console.error("Webhook already exists for this URL. Signing secret cannot be retrieved after creation.");
			console.error("If you need the signing secret, delete the webhook in Clerk Dashboard and re-run setup.");
			console.error(`EXISTING_WEBHOOK_ID=${(match as { id?: string }).id}`);
			process.exit(3); // Special exit code: exists but no secret
		}
	}

	// Create the webhook
	const res = await fetch("https://api.clerk.com/v1/webhooks", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${secretKey}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			url: webhookUrl,
			events: ["user.created", "user.updated", "user.deleted"],
		}),
	});

	if (res.ok) {
		const data = (await res.json()) as { signing_secret?: string; secret?: string };
		const secret = data.signing_secret || data.secret;
		if (secret) {
			console.log(secret);
			process.exit(0);
		}
		// Webhook created but no secret in response
		console.error("Webhook created but signing secret not in API response.");
		console.error("Get it from Clerk Dashboard → Webhooks → your endpoint → Signing Secret");
		process.exit(3);
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
