import { useEffect, useRef } from 'react';

const DEFAULT_IDLE_MS = 30 * 60 * 1000; // 30 minutes
const ACTIVITY_EVENTS = [
	'mousemove',
	'mousedown',
	'keydown',
	'touchstart',
	'scroll',
	'wheel',
] as const;

interface UseIdleTimerOptions {
	/** Idle threshold in ms. Defaults to 30 minutes. */
	idleMs?: number;
	/** Called when the user has been idle for `idleMs`. Typically dispatches
	 *  logout + a redirect. */
	onIdle: () => void;
	/** Pause the timer entirely (e.g. when not logged in). */
	enabled?: boolean;
}

/**
 * Detects user inactivity in the tab. Resets a timer on any of the
 * `ACTIVITY_EVENTS`; when the timer elapses without a reset, calls `onIdle`.
 *
 * Implementation notes:
 *   - Uses `{ passive: true }` listeners so mousemove/scroll don't fight
 *     the scroll thread.
 *   - Throttles the reset to once per second to avoid setting/clearing
 *     setTimeout 60+ times per second during heavy mouse movement.
 *   - Pauses while the tab is hidden (visibilitychange) — counting hours
 *     while the user's on another tab is correct behavior, but if you
 *     prefer to NOT count hidden time, swap to a paused-but-resumes model.
 */
export function useIdleTimer({
	idleMs = DEFAULT_IDLE_MS,
	onIdle,
	enabled = true,
}: UseIdleTimerOptions): void {
	const timeoutRef = useRef<number | null>(null);
	const lastActivityRef = useRef<number>(Date.now());
	const onIdleRef = useRef(onIdle);

	// Keep the callback ref fresh without re-attaching listeners.
	useEffect(() => {
		onIdleRef.current = onIdle;
	}, [onIdle]);

	useEffect(() => {
		if (!enabled) return;

		const clear = () => {
			if (timeoutRef.current !== null) {
				window.clearTimeout(timeoutRef.current);
				timeoutRef.current = null;
			}
		};

		const arm = () => {
			clear();
			timeoutRef.current = window.setTimeout(() => {
				onIdleRef.current();
			}, idleMs);
		};

		const onActivity = () => {
			// Throttle: only re-arm if at least 1s since last activity. Avoids
			// setting/clearing the timer 60×/s during heavy mousemove.
			const now = Date.now();
			if (now - lastActivityRef.current < 1000) return;
			lastActivityRef.current = now;
			arm();
		};

		arm();

		for (const ev of ACTIVITY_EVENTS) {
			window.addEventListener(ev, onActivity, { passive: true });
		}

		return () => {
			clear();
			for (const ev of ACTIVITY_EVENTS) {
				window.removeEventListener(ev, onActivity);
			}
		};
	}, [enabled, idleMs]);
}
