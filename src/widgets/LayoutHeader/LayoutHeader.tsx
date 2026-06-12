import { FC, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import useCurrentUser from '../../hooks/useCurrentUser';
import { imgSrc, TRANSFORMS } from '../../util/helperFunctions/cloudinary';
import { gsap, prefersReducedMotion } from '../../lib/motion';
import { Magnetic } from '../../patterns/Magnetic/Magnetic';
import MenuOverlay from './MenuOverlay';
import { cn } from '../../lib/cn';

const formatClock = (date: Date): string => {
	const h = date.getHours().toString().padStart(2, '0');
	const m = date.getMinutes().toString().padStart(2, '0');
	return `${h}:${m}`;
};

const useLiveClock = (): string => {
	const [time, setTime] = useState(() => formatClock(new Date()));
	useEffect(() => {
		const tick = () => setTime(formatClock(new Date()));
		tick();
		const id = window.setInterval(tick, 15_000);
		return () => window.clearInterval(id);
	}, []);
	return time;
};

const HIDE_THRESHOLD = 90; // px scrolled before hide-on-scroll engages
const MIN_DELTA = 5; // ignore sub-pixel scroll jitter

const LayoutHeader: FC = () => {
	const { user, isLoggedIn } = useCurrentUser();
	const [menuOpen, setMenuOpen] = useState(false);
	const time = useLiveClock();
	const [scrolled, setScrolled] = useState(false);

	const headerRef = useRef<HTMLElement>(null);
	const revealRef = useRef<HTMLButtonElement>(null);
	const visibleRef = useRef(true); // is the header currently shown?
	const lastYRef = useRef(0);
	const showHeaderRef = useRef<(show: boolean) => void>(() => {});

	/**
	 * jitter.video-style scroll-reveal header:
	 *  - scrolling DOWN past the threshold slides the header up out of view
	 *    (GSAP yPercent) and pops in a floating hamburger button;
	 *  - scrolling UP brings the header straight back and tucks the button away;
	 *  - clicking the hamburger also reveals the header on demand.
	 * GSAP owns the `transform`; Tailwind only animates bg/border/blur.
	 */
	useEffect(() => {
		const header = headerRef.current;
		const revealBtn = revealRef.current;
		if (!header) return;

		const reduce = prefersReducedMotion();
		if (revealBtn) gsap.set(revealBtn, { autoAlpha: 0, y: -14, scale: 0.85 });

		showHeaderRef.current = (show: boolean) => {
			if (reduce) {
				gsap.set(header, { yPercent: show ? 0 : -140 });
				if (revealBtn) gsap.set(revealBtn, { autoAlpha: show ? 0 : 1, y: show ? -14 : 0, scale: show ? 0.85 : 1 });
				return;
			}
			gsap.to(header, {
				yPercent: show ? 0 : -140,
				duration: 0.6,
				ease: 'power3.out',
				overwrite: true,
			});
			if (revealBtn) {
				gsap.to(revealBtn, {
					autoAlpha: show ? 0 : 1,
					y: show ? -14 : 0,
					scale: show ? 0.85 : 1,
					duration: show ? 0.3 : 0.5,
					ease: show ? 'power2.in' : 'back.out(1.6)',
					overwrite: true,
				});
			}
		};

		lastYRef.current = window.scrollY;
		let ticking = false;
		const onScroll = () => {
			if (ticking) return;
			ticking = true;
			window.requestAnimationFrame(() => {
				const y = window.scrollY;
				setScrolled(y > 50);
				const goingDown = y > lastYRef.current;
				const delta = Math.abs(y - lastYRef.current);

				if (goingDown && y > HIDE_THRESHOLD && delta > MIN_DELTA) {
					if (visibleRef.current) {
						visibleRef.current = false;
						showHeaderRef.current(false);
					}
				} else if ((!goingDown && delta > MIN_DELTA) || y <= HIDE_THRESHOLD) {
					if (!visibleRef.current) {
						visibleRef.current = true;
						showHeaderRef.current(true);
					}
				}
				lastYRef.current = y;
				ticking = false;
			});
		};
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	const revealHeader = () => {
		if (!visibleRef.current) {
			visibleRef.current = true;
			showHeaderRef.current(true);
		}
	};

	return (
		<>
			<header
				ref={headerRef}
				className={cn(
					'sticky top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-base ease-out-quart will-change-transform',
					scrolled
						? 'bg-bg-base/85 backdrop-blur-xl border-b border-line-subtle'
						: 'bg-transparent border-b border-transparent',
				)}
			>
				<div className='max-w-screen-2xl mx-auto px-5 sm:px-8 lg:px-12 h-[68px] sm:h-[76px] flex items-center justify-between gap-4'>
					{/* LEFT — Wordmark */}
					<Link to='/' className='inline-flex items-center gap-2 group shrink-0'>
						<span
							className='font-display italic font-medium text-ink-primary tracking-[-0.02em] leading-none transition-colors group-hover:text-clay-400'
							style={{ fontSize: 'clamp(20px, 1.6vw, 26px)', fontVariationSettings: '"opsz" 36' }}
						>
							EduCourse
						</span>
						<span
							aria-hidden
							className='hidden sm:inline-block h-1.5 w-1.5 rounded-full bg-clay-500 mt-0.5 transition-transform group-hover:scale-150'
						/>
					</Link>

					{/* CENTER — Live status (desktop only) */}
					<div className='hidden lg:flex items-center gap-3 font-mono text-2xs uppercase tracking-[0.22em] text-ink-secondary'>
						<span className='inline-flex items-center gap-1.5'>
							<span aria-hidden className='inline-block h-1.5 w-1.5 rounded-full bg-clay-500 animate-pulse' />
							{time} · LAGOS
						</span>
						<span aria-hidden className='h-3 w-px bg-line-base' />
						<span className='text-ink-tertiary'>Learning in session</span>
					</div>

					{/* RIGHT — Auth + Menu */}
					<div className='flex items-center gap-2 sm:gap-3 shrink-0'>
						{isLoggedIn ? (
							<>
								<Link
									to='/notifications'
									aria-label='Notifications'
									className='hidden sm:inline-grid place-items-center h-10 w-10 rounded-full border border-line-base text-ink-secondary hover:text-ink-primary hover:border-clay-500 transition-colors'
								>
									<Bell size={15} strokeWidth={2} />
								</Link>
								<Link
									to='/profile'
									className='hidden sm:inline-flex items-center gap-2 h-10 pl-1.5 pr-4 rounded-pill border border-line-base hover:border-clay-500 transition-colors group'
								>
									<span className='inline-block h-7 w-7 rounded-full overflow-hidden bg-bg-raised'>
										{user?.photo ? (
											<img
												src={imgSrc(user.photo, '/img/', TRANSFORMS.avatarSm)}
												alt={user.name}
												className='h-full w-full object-cover'
											/>
										) : (
											<span className='grid place-items-center h-full w-full font-display italic text-clay-400 text-sm'>
												{user?.name?.charAt(0)?.toUpperCase() ?? '?'}
											</span>
										)}
									</span>
									<span className='font-body text-xs text-ink-primary group-hover:text-clay-400 transition-colors max-w-[100px] truncate'>
										{user?.name?.split(' ')[0]}
									</span>
								</Link>
							</>
						) : (
							<Link
								to='/signin'
								className='hidden sm:inline-flex items-center h-10 px-4 rounded-pill text-ink-primary hover:text-clay-400 transition-colors font-body text-sm'
							>
								Sign in
							</Link>
						)}

						{!isLoggedIn && (
							<Magnetic strength={0.18}>
								<Link
									to='/signup'
									data-cursor='grow'
									className='hidden sm:inline-flex items-center h-10 px-5 rounded-pill bg-clay-500 hover:bg-clay-600 text-ink-primary font-body font-medium text-sm transition-colors'
								>
									Start
								</Link>
							</Magnetic>
						)}

						{/* Menu button */}
						<Magnetic strength={0.16}>
							<button
								type='button'
								onClick={() => setMenuOpen(true)}
								aria-label='Open menu'
								data-cursor='grow'
								className='group inline-flex items-center gap-3 h-10 pl-4 pr-1.5 rounded-pill bg-bg-raised border border-line-base hover:border-clay-500 transition-colors'
							>
								<span className='font-mono text-2xs uppercase tracking-[0.22em] text-ink-primary group-hover:text-clay-400 transition-colors'>
									Menu
								</span>
								<span
									aria-hidden
									className='inline-flex flex-col gap-[3px] items-end justify-center h-7 w-7 rounded-full bg-ink-primary group-hover:bg-clay-500 transition-colors'
								>
									<span className='h-[1.5px] w-3.5 bg-bg-base rounded-full transition-all duration-base ease-out-quart group-hover:w-4' />
									<span className='h-[1.5px] w-2.5 bg-bg-base rounded-full transition-all duration-base ease-out-quart group-hover:w-4' />
								</span>
							</button>
						</Magnetic>
					</div>
				</div>
			</header>

			{/* Floating reveal control — GSAP pops it in when the header hides on
				 scroll-down; clicking it animates the full header back into view.
				 Editorial "Menu" pill matching the header's own menu button.
				 Visibility/position is driven entirely by GSAP (autoAlpha). */}
			<button
				ref={revealRef}
				type='button'
				onClick={revealHeader}
				aria-label='Show navigation'
				className={cn(
					'group fixed top-5 right-5 sm:right-8 z-[60] will-change-transform',
					'inline-flex items-center gap-3 h-11 pl-4 pr-1.5 rounded-pill',
					'bg-bg-raised/90 backdrop-blur-xl border border-line-base shadow-warm-3',
					'hover:border-clay-500 transition-colors',
					'focus-visible:outline-none focus-visible:shadow-focus-ring',
				)}
			>
				<span className='font-mono text-2xs uppercase tracking-[0.22em] text-ink-primary group-hover:text-clay-400 transition-colors'>
					Menu
				</span>
				<span
					aria-hidden
					className='inline-flex flex-col gap-[3px] items-end justify-center h-8 w-8 rounded-full bg-ink-primary group-hover:bg-clay-500 transition-colors'
				>
					<span className='h-[1.5px] w-4 bg-bg-base rounded-full transition-all duration-base ease-out-quart group-hover:w-[18px]' />
					<span className='h-[1.5px] w-3 bg-bg-base rounded-full transition-all duration-base ease-out-quart group-hover:w-[18px]' />
				</span>
			</button>

			<MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
		</>
	);
};

export default LayoutHeader;
