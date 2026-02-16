#!/usr/bin/env bash
set -euo pipefail

# sync-template.sh — Compare and sync infrastructure files from the template repo.
# Usage: sync-template.sh <command> [args]
#
# Commands:
#   scan [template-dir]            Compare all tracked files between repos
#   apply-category-a [template-dir] Copy all changed Category A files from template
#   apply-file <path> [template-dir] Copy a single file from template
#   diff-file <path> [template-dir]  Show unified diff for a single file
#   help                            Show this help message

DEFAULT_TEMPLATE_DIR="../nextjs-convex-clerk-template"

# Category A: Safe infrastructure files — batch copy
CATEGORY_A_FILES=(
	".devcontainer"
	".claude/settings.json"
	".claude/skills"
	".agents/skills"
	".github/workflows/test.yml"
	"biome.json"
	"tsconfig.json"
	"vitest.config.ts"
	"playwright.config.ts"
	"postcss.config.mjs"
	"components.json"
	"wrangler.jsonc"
	"open-next.config.ts"
	"test/setup.ts"
	"test/mocks/convex.ts"
	"test/fixtures/index.ts"
	"test/utils/test-utils.tsx"
	".gitignore"
)

# Category B: Caution files — individual review with diffs
CATEGORY_B_FILES=(
	"CLAUDE.md"
	"SETUP.md"
	"next.config.ts"
)

resolve_template_dir() {
	local dir="${1:-$DEFAULT_TEMPLATE_DIR}"
	if [[ ! -d "$dir" ]]; then
		echo "ERROR: Template directory not found: $dir" >&2
		echo "Expected the template repo to be cloned as a sibling directory." >&2
		exit 1
	fi
	echo "$dir"
}

compare_path() {
	local path="$1"
	local template_dir="$2"
	local src="$template_dir/$path"
	local dst="./$path"

	if [[ ! -e "$src" ]]; then
		echo "missing-in-template"
	elif [[ ! -e "$dst" ]]; then
		echo "new"
	elif [[ -d "$src" ]]; then
		if diff -rq "$src" "$dst" > /dev/null 2>&1; then
			echo "unchanged"
		else
			echo "changed"
		fi
	else
		if diff -q "$src" "$dst" > /dev/null 2>&1; then
			echo "unchanged"
		else
			echo "changed"
		fi
	fi
}

cmd_scan() {
	local template_dir
	template_dir=$(resolve_template_dir "${1:-}")

	echo "Template: $template_dir"
	echo ""

	echo "=== Category A (safe — batch copy) ==="
	printf "%-45s %s\n" "FILE" "STATUS"
	printf "%-45s %s\n" "----" "------"
	for path in "${CATEGORY_A_FILES[@]}"; do
		local status
		status=$(compare_path "$path" "$template_dir")
		printf "%-45s %s\n" "$path" "$status"
	done

	echo ""
	echo "=== Category B (caution — individual review) ==="
	printf "%-45s %s\n" "FILE" "STATUS"
	printf "%-45s %s\n" "----" "------"
	for path in "${CATEGORY_B_FILES[@]}"; do
		local status
		status=$(compare_path "$path" "$template_dir")
		printf "%-45s %s\n" "$path" "$status"
	done

	echo ""
	echo "=== Category C (never touched) ==="
	echo "Skipped: app/, components/, convex/, hooks/, lib/, public/, package.json, bun.lock, .env.example, middleware.ts"
}

cmd_apply_category_a() {
	local template_dir
	template_dir=$(resolve_template_dir "${1:-}")

	local applied=0
	local skipped=0

	for path in "${CATEGORY_A_FILES[@]}"; do
		local status
		status=$(compare_path "$path" "$template_dir")

		if [[ "$status" == "changed" || "$status" == "new" ]]; then
			local src="$template_dir/$path"
			local dst="./$path"

			# Create parent directory if needed
			mkdir -p "$(dirname "$dst")"

			if [[ -d "$src" ]]; then
				# For directories, remove dst first then copy
				rm -rf "$dst"
				cp -r "$src" "$dst"
			else
				cp "$src" "$dst"
			fi

			echo "  Copied: $path ($status)"
			((applied++))
		else
			((skipped++))
		fi
	done

	echo ""
	echo "Applied: $applied file(s), Skipped: $skipped unchanged/missing"
}

cmd_apply_file() {
	local path="${1:-}"
	if [[ -z "$path" ]]; then
		echo "ERROR: No file path specified." >&2
		echo "Usage: sync-template.sh apply-file <path> [template-dir]" >&2
		exit 1
	fi

	local template_dir
	template_dir=$(resolve_template_dir "${2:-}")

	local src="$template_dir/$path"
	local dst="./$path"

	if [[ ! -e "$src" ]]; then
		echo "ERROR: File not found in template: $src" >&2
		exit 1
	fi

	mkdir -p "$(dirname "$dst")"

	if [[ -d "$src" ]]; then
		rm -rf "$dst"
		cp -r "$src" "$dst"
	else
		cp "$src" "$dst"
	fi

	echo "Copied: $path"
}

cmd_diff_file() {
	local path="${1:-}"
	if [[ -z "$path" ]]; then
		echo "ERROR: No file path specified." >&2
		echo "Usage: sync-template.sh diff-file <path> [template-dir]" >&2
		exit 1
	fi

	local template_dir
	template_dir=$(resolve_template_dir "${2:-}")

	local src="$template_dir/$path"
	local dst="./$path"

	if [[ ! -e "$src" ]]; then
		echo "ERROR: File not found in template: $src" >&2
		exit 1
	fi

	if [[ ! -e "$dst" ]]; then
		echo "--- (new file from template)"
		echo "+++ $path"
		echo ""
		if [[ -d "$src" ]]; then
			echo "(directory — new in template)"
		else
			cat "$src"
		fi
		return
	fi

	if [[ -d "$src" ]]; then
		diff -ru "$dst" "$src" || true
	else
		diff -u "$dst" "$src" --label "current/$path" --label "template/$path" || true
	fi
}

cmd_help() {
	echo "sync-template.sh — Compare and sync infrastructure files from the template repo."
	echo ""
	echo "Usage: sync-template.sh <command> [args]"
	echo ""
	echo "Commands:"
	echo "  scan [template-dir]              Compare all tracked files between repos"
	echo "  apply-category-a [template-dir]  Copy all changed Category A files from template"
	echo "  apply-file <path> [template-dir] Copy a single file from template"
	echo "  diff-file <path> [template-dir]  Show unified diff for a single file"
	echo "  help                             Show this help message"
	echo ""
	echo "Default template-dir: $DEFAULT_TEMPLATE_DIR"
}

# Main dispatch
command="${1:-help}"
shift || true

case "$command" in
	scan) cmd_scan "$@" ;;
	apply-category-a) cmd_apply_category_a "$@" ;;
	apply-file) cmd_apply_file "$@" ;;
	diff-file) cmd_diff_file "$@" ;;
	help) cmd_help ;;
	*)
		echo "ERROR: Unknown command: $command" >&2
		cmd_help >&2
		exit 1
		;;
esac
