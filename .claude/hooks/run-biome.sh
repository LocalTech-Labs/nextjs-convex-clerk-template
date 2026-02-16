#!/bin/bash
# PostToolUse hook: Run Biome lint+format check after file writes/edits
# Runs synchronously — blocks Claude until complete so it sees errors immediately

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only check source files
case "$FILE_PATH" in
	*.ts|*.tsx|*.js|*.jsx|*.json|*.css) ;;
	*) exit 0 ;;
esac

# Skip generated files
case "$FILE_PATH" in
	*/convex/_generated/*) exit 0 ;;
	*node_modules*) exit 0 ;;
esac

cd "$CLAUDE_PROJECT_DIR" || exit 0

OUTPUT=$(bun run check 2>&1)
EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ]; then
	# Trim output to last 50 lines to avoid overwhelming context
	TRIMMED=$(echo "$OUTPUT" | tail -50)
	cat <<EOF
{"decision":"block","reason":"Biome check failed. Fix these issues before continuing:\n\n$TRIMMED"}
EOF
	exit 0
fi

echo '{"additionalContext":"Biome lint and format checks passed."}'
exit 0
