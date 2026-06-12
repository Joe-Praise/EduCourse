/**
 * Minimal feature-flag system.
 *
 * Flags are env-driven: each one reads `import.meta.env.VITE_FF_<NAME>` and
 * falls back to the default in `DEFAULT_FLAGS` below. Add a new flag by:
 *   1. Adding it to `FLAG_NAMES` (the discriminated union becomes the public type)
 *   2. Setting its default in `DEFAULT_FLAGS`
 *   3. (Optional) Documenting it in `.env.example` so contributors know it exists
 *
 * Why no runtime toggle UI? In this codebase, feature flags are for staged
 * rollouts driven by deployment env vars — not user-facing experiments.
 * If we need per-user variants later, swap this for LaunchDarkly / GrowthBook.
 */

export const FLAG_NAMES = [
	'liveNotifications',
	'aiRecommendations',
	'aiLearningPaths',
	'aiQuizzes',
	'searchPage',
	'certificates',
] as const;

export type FeatureFlag = (typeof FLAG_NAMES)[number];

const DEFAULT_FLAGS: Record<FeatureFlag, boolean> = {
	liveNotifications: true,
	aiRecommendations: false, // gated until the agent service is configured
	aiLearningPaths: false,
	aiQuizzes: false,
	searchPage: true,
	certificates: true,
};

const ENV_PREFIX = 'VITE_FF_';

const parseEnv = (name: FeatureFlag): boolean | null => {
	const raw = (import.meta.env as Record<string, string | undefined>)[
		`${ENV_PREFIX}${name}`
	];
	if (raw === undefined) return null;
	const normalized = raw.toLowerCase().trim();
	if (normalized === 'true' || normalized === '1') return true;
	if (normalized === 'false' || normalized === '0') return false;
	return null;
};

/**
 * Synchronous read for non-React contexts (action thunks, etc).
 * Returns the env override if set; otherwise the default.
 */
export const getFlag = (name: FeatureFlag): boolean => {
	const fromEnv = parseEnv(name);
	return fromEnv === null ? DEFAULT_FLAGS[name] : fromEnv;
};

/**
 * React hook — same value as `getFlag` but suitable for use in components.
 * Doesn't subscribe to changes (flags are immutable for the page session).
 */
export const useFeatureFlag = (name: FeatureFlag): boolean => getFlag(name);
