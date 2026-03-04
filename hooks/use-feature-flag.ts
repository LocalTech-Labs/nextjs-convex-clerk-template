"use client";

import { useFeatureFlagEnabled } from "posthog-js/react";

export function useFeatureFlag(flag: string): boolean {
	return useFeatureFlagEnabled(flag) ?? false;
}
