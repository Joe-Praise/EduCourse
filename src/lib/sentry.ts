import * as Sentry from '@sentry/react';

/**
 * Sentry initialization for the EduCourse frontend.
 *
 * No-op when `VITE_SENTRY_DSN` is empty so local dev works with zero config.
 * Call once from the app entry point (main.tsx) BEFORE rendering React.
 */
let initialized = false;

export function initSentry(): void {
	if (initialized) return;
	initialized = true;

	const dsn = import.meta.env.VITE_SENTRY_DSN;
	if (!dsn) {
		if (import.meta.env.DEV) {

			console.debug('[sentry] VITE_SENTRY_DSN not set; skipping init');
		}
		return;
	}

	Sentry.init({
		dsn,
		environment: import.meta.env.MODE,
		tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
		replaysSessionSampleRate: 0,
		replaysOnErrorSampleRate: 0.1,
		integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
	});
}

export { Sentry };
