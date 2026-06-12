import { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircle2, AlertTriangle, AlertOctagon, Info, X } from 'lucide-react';
import { AppDispatch, RootState } from '../../redux/store';
import { clearNotification } from '../../redux/actions/notification';
import { cn } from '../../lib/cn';

/**
 * Editorial toast renderer.
 *
 * Replaces the previous react-toastify + NotificationProvider setup with an
 * editorial-styled stack that drains the same Redux notification queue. Other
 * code keeps dispatching `addNotification({ message, type })` — no upstream
 * changes needed.
 *
 * Per-toast lifecycle:
 *   1. New entries in `state.notification.notification[]` are snapshotted into
 *      local state (so the Redux queue can be cleared immediately).
 *   2. Each toast renders with a slide-in (transform + opacity), a persona-
 *      colored left stripe, mono caps eyebrow, body message, and a thin
 *      progress strip animating to empty.
 *   3. Hover pauses the progress timer; click dismisses immediately.
 *   4. On dismiss (auto or manual) the toast slides out, then unmounts.
 */

type ToastType = 'info' | 'success' | 'warning' | 'error' | 'default';

interface ActiveToast {
	uid: string;
	message: string;
	type: ToastType;
	createdAt: number;
	durationMs: number;
	/** Set when the user clicks dismiss or the timer fires; triggers slide-out. */
	leaving: boolean;
}

const DEFAULT_DURATION: Record<ToastType, number> = {
	info: 4000,
	success: 3500,
	warning: 5000,
	error: 6500,
	default: 4000,
};

const MAX_TOASTS = 4;

const ICON: Record<ToastType, typeof CheckCircle2> = {
	success: CheckCircle2,
	error: AlertOctagon,
	warning: AlertTriangle,
	info: Info,
	default: Info,
};

const LABEL: Record<ToastType, string> = {
	success: 'Done',
	error: 'Error',
	warning: 'Heads up',
	info: 'Notice',
	default: 'Notice',
};

const TONE: Record<
	ToastType,
	{
		stripe: string;
		accent: string;
		ring: string;
		role: 'status' | 'alert';
		live: 'polite' | 'assertive';
	}
> = {
	success: {
		stripe: 'bg-signal-success',
		accent: 'text-signal-success',
		ring: 'ring-signal-success/30',
		role: 'status',
		live: 'polite',
	},
	error: {
		stripe: 'bg-signal-danger',
		accent: 'text-signal-danger',
		ring: 'ring-signal-danger/30',
		role: 'alert',
		live: 'assertive',
	},
	warning: {
		stripe: 'bg-signal-warning',
		accent: 'text-signal-warning',
		ring: 'ring-signal-warning/30',
		role: 'alert',
		live: 'assertive',
	},
	info: {
		stripe: 'bg-clay-500',
		accent: 'text-clay-400',
		ring: 'ring-clay-500/30',
		role: 'status',
		live: 'polite',
	},
	default: {
		stripe: 'bg-ink-tertiary',
		accent: 'text-ink-secondary',
		ring: 'ring-line-base',
		role: 'status',
		live: 'polite',
	},
};

const formatClock = (ts: number): string => {
	const d = new Date(ts);
	const h = d.getHours().toString().padStart(2, '0');
	const m = d.getMinutes().toString().padStart(2, '0');
	return `${h}:${m}`;
};

interface ToastCardProps {
	toast: ActiveToast;
	onDismiss: (uid: string) => void;
}

const ToastCard = ({ toast, onDismiss }: ToastCardProps) => {
	const [mounted, setMounted] = useState(false);
	const [paused, setPaused] = useState(false);
	const timerRef = useRef<number | null>(null);
	const remainingRef = useRef<number>(toast.durationMs);
	const startRef = useRef<number>(Date.now());

	const Icon = ICON[toast.type];
	const tone = TONE[toast.type];

	// Trigger the enter transition on the next frame so the initial style
	// (translate-x-full + opacity-0) actually paints before we flip to the
	// target style — otherwise the transition is skipped.
	useEffect(() => {
		const t = window.setTimeout(() => setMounted(true), 16);
		return () => window.clearTimeout(t);
	}, []);

	// Auto-dismiss timer with pause-on-hover support
	useEffect(() => {
		if (toast.leaving) return;
		if (paused) {
			if (timerRef.current !== null) {
				window.clearTimeout(timerRef.current);
				timerRef.current = null;
				remainingRef.current -= Date.now() - startRef.current;
			}
			return;
		}
		startRef.current = Date.now();
		timerRef.current = window.setTimeout(() => {
			onDismiss(toast.uid);
		}, Math.max(remainingRef.current, 200));
		return () => {
			if (timerRef.current !== null) window.clearTimeout(timerRef.current);
		};
	}, [paused, toast.leaving, toast.uid, onDismiss]);

	// Once `leaving` is set, give the slide-out 320ms then signal removal
	// (the parent already removed from state — this just gates re-render).
	const isVisible = mounted && !toast.leaving;

	return (
		<div
			role={tone.role}
			aria-live={tone.live}
			onMouseEnter={() => setPaused(true)}
			onMouseLeave={() => setPaused(false)}
			onClick={() => onDismiss(toast.uid)}
			className={cn(
				'relative w-[320px] sm:w-[360px] cursor-pointer select-none',
				'rounded-card overflow-hidden ring-1 ring-inset',
				'bg-bg-raised/95 backdrop-blur-xl shadow-warm-3',
				'transition-[transform,opacity] duration-slow ease-out-quart',
				tone.ring,
				isVisible
					? 'translate-x-0 opacity-100'
					: 'translate-x-[calc(100%+2rem)] opacity-0',
			)}
			style={{ willChange: 'transform, opacity' }}
		>
			{/* Left persona-color stripe */}
			<span aria-hidden className={cn('absolute left-0 top-0 bottom-0 w-[3px]', tone.stripe)} />

			<div className='pl-5 pr-3 py-3.5 flex items-start gap-3'>
				<Icon
					size={16}
					strokeWidth={1.75}
					className={cn('shrink-0 mt-0.5', tone.accent)}
				/>

				<div className='flex-1 min-w-0'>
					<div className='flex items-baseline gap-2 mb-1'>
						<span className={cn('font-mono text-2xs uppercase tracking-[0.22em]', tone.accent)}>
							{LABEL[toast.type]}
						</span>
						<span aria-hidden className='font-mono text-2xs text-ink-tertiary/70 tabular-nums'>
							· {formatClock(toast.createdAt)}
						</span>
					</div>
					<p className='font-body text-sm text-ink-primary leading-[1.5] break-words'>
						{toast.message}
					</p>
				</div>

				<button
					type='button'
					aria-label='Dismiss notification'
					onClick={(e) => {
						e.stopPropagation();
						onDismiss(toast.uid);
					}}
					className='shrink-0 -mr-1 inline-grid place-items-center h-7 w-7 rounded-full text-ink-tertiary hover:text-ink-primary hover:bg-bg-overlay/60 transition-colors'
				>
					<X size={12} strokeWidth={2} />
				</button>
			</div>

			{/* Bottom progress strip — depletes over duration. CSS animation so
				 the bar runs on the compositor; we restart it by remounting via
				 a key swap when `paused` toggles. */}
			<ProgressStrip
				key={`${toast.uid}-${paused ? 'pause' : 'run'}`}
				duration={remainingRef.current}
				paused={paused || toast.leaving}
				toneClass={tone.stripe}
			/>
		</div>
	);
};

const ProgressStrip = ({
	duration,
	paused,
	toneClass,
}: {
	duration: number;
	paused: boolean;
	toneClass: string;
}) => (
	<span
		aria-hidden
		className='absolute left-0 bottom-0 h-[2px] bg-line-subtle/40 w-full overflow-hidden'
	>
		<span
			className={cn('block h-full origin-left', toneClass)}
			style={{
				animation: paused
					? 'none'
					: `toast-deplete ${duration}ms linear forwards`,
			}}
		/>
	</span>
);

const Toastify = () => {
	const dispatch: AppDispatch = useDispatch();
	const queued = useSelector((state: RootState) => state.notification.notification);
	const [toasts, setToasts] = useState<ActiveToast[]>([]);

	const dismiss = useCallback((uid: string) => {
		// Mark as leaving (slide-out), then remove after the transition.
		setToasts((prev) =>
			prev.map((t) => (t.uid === uid ? { ...t, leaving: true } : t)),
		);
		window.setTimeout(() => {
			setToasts((prev) => prev.filter((t) => t.uid !== uid));
		}, 320);
	}, []);

	// Drain Redux queue into local state on each push, then clear Redux.
	useEffect(() => {
		if (queued.length === 0) return;
		const now = Date.now();
		setToasts((prev) => {
			const next = [...prev];
			for (const entry of queued) {
				const type = (entry.type ?? 'default') as ToastType;
				next.push({
					uid: `${now}-${Math.random().toString(36).slice(2, 8)}`,
					message: entry.message,
					type,
					createdAt: now,
					durationMs: DEFAULT_DURATION[type],
					leaving: false,
				});
			}
			// Cap the stack — auto-leave the oldest if we exceed MAX_TOASTS.
			while (next.filter((t) => !t.leaving).length > MAX_TOASTS) {
				const oldest = next.find((t) => !t.leaving);
				if (oldest) oldest.leaving = true;
			}
			return next;
		});
		dispatch(clearNotification());
	}, [queued, dispatch]);

	if (typeof document === 'undefined') return null;

	return createPortal(
		<>
			{/* Inline keyframes so this file is self-contained — avoids touching
				 the global stylesheet for a leaf component. */}
			<style>
				{`@keyframes toast-deplete { from { transform: scaleX(1); } to { transform: scaleX(0); } }`}
			</style>
			<div
				aria-label='Notifications'
				className='fixed top-4 right-4 sm:top-6 sm:right-6 z-[70] flex flex-col gap-2.5 pointer-events-none'
			>
				{toasts.map((toast) => (
					<div key={toast.uid} className='pointer-events-auto'>
						<ToastCard toast={toast} onDismiss={dismiss} />
					</div>
				))}
			</div>
		</>,
		document.body,
	);
};

export default Toastify;
