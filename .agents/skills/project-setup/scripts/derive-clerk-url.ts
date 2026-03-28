#!/usr/bin/env bun
/**
 * Derive the Clerk Frontend API URL from a publishable key.
 * The publishable key encodes the FAPI domain in base64.
 *
 * Usage: bun run derive-clerk-url.ts <publishable-key>
 * Output: https://<domain>.clerk.accounts.dev
 */

const pk = process.argv[2];

if (!pk) {
	console.error("Usage: bun run derive-clerk-url.ts <publishable-key>");
	process.exit(2);
}

if (!pk.startsWith("pk_test_") && !pk.startsWith("pk_live_")) {
	console.error("Error: Publishable key must start with pk_test_ or pk_live_");
	process.exit(1);
}

try {
	// Strip the prefix (pk_test_ or pk_live_)
	const prefix = pk.startsWith("pk_test_") ? "pk_test_" : "pk_live_";
	const encoded = pk.slice(prefix.length);

	// Base64 decode
	const decoded = atob(encoded);

	// Remove trailing $ if present
	const domain = decoded.endsWith("$") ? decoded.slice(0, -1) : decoded;

	if (!domain.includes("clerk")) {
		console.error(`Warning: Decoded domain doesn't look like a Clerk domain: ${domain}`);
		console.error("The publishable key may be malformed.");
		process.exit(1);
	}

	const url = `https://${domain}`;
	console.log(url);
} catch (e) {
	console.error(`Error decoding publishable key: ${e instanceof Error ? e.message : e}`);
	process.exit(1);
}
