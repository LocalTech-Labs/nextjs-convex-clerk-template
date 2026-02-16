#!/bin/bash
# PostToolUse hook: Run Vitest unit tests after file writes/edits
# Runs async — Claude continues working while tests run in background

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only run tests when source or test files change
case "$FILE_PATH" in
	*.ts|*.tsx|*.js|*.jsx) ;;
	*) exit 0 ;;
esac

# Skip generated files and non-testable files
case "$FILE_PATH" in
	*/convex/_generated/*) exit 0 ;;
	*node_modules*) exit 0 ;;
	*.config.*) exit 0 ;;
esac

cd "$CLAUDE_PROJECT_DIR" || exit 0

OUTPUT=$(bun run test --run 2>&1)
EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ]; then
	TRIMMED=$(echo "$OUTPUT" | tail -80)
	cat <<EOF
{"decision":"block","reason":"Unit tests failed. Fix these failures:\n\n$TRIMMED"}
EOF
	exit 0
fi

# Count passing tests from output
PASS_COUNT=$(echo "$OUTPUT" | grep -oP '\d+ passed' | head -1)
echo "{\"additionalContext\":\"Unit tests passed ($PASS_COUNT).\"}"
exit 0
