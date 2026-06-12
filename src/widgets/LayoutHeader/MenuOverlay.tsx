import { FC, MouseEvent, useCallback, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ArrowUpRight, Plus } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import { gsap, prefersReducedMotion } from '../../lib/motion';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { logoutAction } from '../../redux/actions/authAction';
import useCurrentUser from '../../hooks/useCurrentUser';
import { cn } from '../../lib/cn';
import card1 from '../../assets/image/card1.jpg';
import card2 from '../../assets/image/card2.jpg';
import card3 from '../../assets/image/card3.jpg';
import card4 from '../../assets/image/card4.jpg';
import card5 from '../../assets/image/card5.jpg';
import card6 from '../../assets/image/card6.jpg';

interface PrimaryLink {
	id: number;
	num: string;
	name: string;
	accent?: string;
	path: string;
	image: string;
	authOnly?: boolean;
}

interface SecondaryLink {
	id: number;
	name: string;
	path: string;
	authOnly?: boolean;
	instructorOnly?: boolean;
}

const PRIMARY_LINKS: PrimaryLink[] = [
	{ id: 1, num: '01', name: 'Home',        accent: 'Home',        path: '/',                       image: card1 },
	{ id: 2, num: '02', name: 'Courses',     accent: 'work',        path: '/courses',                image: card4 },
	{ id: 3, num: '03', name: 'Instructors', accent: 'makers',      path: '/instructors',            image: card5 },
	{ id: 4, num: '04', name: 'Blog',        accent: 'archive',     path: '/blogs',                  image: card3 },
	{ id: 5, num: '05', name: 'Library',     accent: 'learning',    path: '/my-courses/learning',    image: card2, authOnly: true },
	{ id: 6, num: '06', name: 'Search',      accent: 'find it',     path: '/search',                 image: card3 },
	{ id: 7, num: '07', name: 'FAQ',         accent: 'questions',   path: '/faqs',                   image: card6 },
];

const SECONDARY_LINKS: SecondaryLink[] = [
	{ id: 1, name: 'Profile',              path: '/profile',              authOnly: true },
	{ id: 2, name: 'Notifications',        path: '/notifications',        authOnly: true },
	{ id: 3, name: 'Wishlist',             path: '/wishlist',             authOnly: true },
	{ id: 4, name: 'Certificates',         path: '/certificates',         authOnly: true },
	{ id: 5, name: 'Instructor dashboard', path: '/instructor/dashboard', authOnly: true, instructorOnly: true },
];

const SOCIAL_LINKS = [
	{ label: 'IG', href: 'https://instagram.com' },
	{ label: 'TW', href: 'https://twitter.com' },
	{ label: 'IN', href: 'https://linkedin.com' },
];

interface MenuOverlayProps {
	open: boolean;
	onClose: () => void;
}

export const MenuOverlay: FC<MenuOverlayProps> = ({ open, onClose }) => {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const panelRef     = useRef<HTMLDivElement | null>(null);
	const linksRef     = useRef<HTMLOListElement | null>(null);
	const footerRef    = useRef<HTMLDivElement | null>(null);
	const headStripRef = useRef<HTMLDivElement | null>(null);
	const flashRef     = useRef<HTMLDivElement | null>(null);

	// Animation state
	const tlRef            = useRef<gsap.core.Timeline | null>(null);
	const animatingClose   = useRef(false);
	const skipCloseEffect  = useRef(false); // set by runClose so useEffect([open]) skips duplicate
	const hasMountedOpen   = useRef(false); // skip very first mount (open=false)

	// Cursor-follow image preview
	const imgWrapRef   = useRef<HTMLDivElement | null>(null);
	const imgInnerRef  = useRef<HTMLDivElement | null>(null);
	const imageRefs    = useRef<Record<string, HTMLImageElement | null>>({});
	const targetPos    = useRef({ x: 0, y: 0 });
	const currentPos   = useRef({ x: 0, y: 0 });
	const rafId        = useRef<number | null>(null);

	// Pointer-driven auto-scroll: when the cursor nears the top/bottom edge the
	// panel glides in that direction — same "image-trail" feel, applied to scroll.
	const pointerY     = useRef<number | null>(null);
	const autoScrollV  = useRef(0);

	const location = useLocation();
	const navigate = useNavigate();
	const dispatch: AppDispatch = useDispatch();
	const { isLoggedIn, isInstructor } = useCurrentUser();

	// ─── Imperative close animation ─────────────────────────────────────────────
	// Called directly from clicks and ESC. Animates FIRST, then calls onDone.
	// This guarantees the animation always runs before navigation happens.
	const runClose = useCallback((onDone?: () => void) => {
		if (animatingClose.current) return;
		animatingClose.current = true;
		skipCloseEffect.current = true; // tell useEffect([open]) to skip its own close

		if (tlRef.current) {
			tlRef.current.kill();
			tlRef.current = null;
		}

		const linkItems = linksRef.current?.querySelectorAll<HTMLLIElement>('li');
		const reduce    = prefersReducedMotion();

		const tl = gsap.timeline({
			onComplete: () => {
				animatingClose.current = false;
				// Reset children to hidden state for next open
				if (linkItems) gsap.set(linkItems, { autoAlpha: 0, y: 60 });
				gsap.set([headStripRef.current, footerRef.current], { autoAlpha: 0, y: -20 });
				gsap.set(flashRef.current, { scaleY: 0, autoAlpha: 0 });
				onDone?.();
			},
		});
		tlRef.current = tl;

		if (linkItems?.length) {
			tl.to(linkItems, {
				y: 30,
				autoAlpha: 0,
				duration: reduce ? 0.1 : 0.22,
				stagger: { each: 0.018, from: 'end' },
				ease: 'power2.in',
			});
		}
		tl.to(
			[headStripRef.current, footerRef.current].filter((el): el is HTMLDivElement => el !== null),
			{ autoAlpha: 0, duration: reduce ? 0.1 : 0.18 },
			reduce ? 0 : '<0.04',
		);
		tl.to(
			panelRef.current,
			{ yPercent: -100, duration: reduce ? 0.22 : 0.48, ease: 'power3.in', force3D: true },
			'-=0.08',
		);
	}, []);

	// ─── Click handlers that animate before navigating ──────────────────────────
	const handleNavClick = useCallback(
		(path: string) => (e: MouseEvent) => {
			e.preventDefault(); // stop NavLink/Link from navigating immediately
			runClose(() => {
				onClose();
				navigate(path);
			});
		},
		[runClose, onClose, navigate],
	);

	const handleCloseButton = useCallback(() => {
		runClose(onClose);
	}, [runClose, onClose]);

	// ─── Body scroll lock ────────────────────────────────────────────────────────
	useEffect(() => {
		if (open) {
			const prev = document.body.style.overflow;
			document.body.style.overflow = 'hidden';
			return () => {
				document.body.style.overflow = prev;
			};
		}
	}, [open]);

	// ─── ESC to close ────────────────────────────────────────────────────────────
	useEffect(() => {
		if (!open) return;
		const handle = (e: KeyboardEvent) => {
			if (e.key === 'Escape') runClose(onClose);
		};
		window.addEventListener('keydown', handle);
		return () => window.removeEventListener('keydown', handle);
	}, [open, onClose, runClose]);

	// ─── Fallback: close on route change if menu is still logically open ─────────
	// (e.g. programmatic navigation from outside the menu)
	useEffect(() => {
		if (open && !animatingClose.current) {
			runClose(onClose);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location.pathname]);

	// ─── GSAP initial state — once on mount ──────────────────────────────────────
	useGSAP(
		() => {
			if (!panelRef.current) return;
			gsap.set(panelRef.current, { yPercent: -100 });
			gsap.set(flashRef.current, { scaleY: 0, transformOrigin: 'top center', autoAlpha: 0 });
			gsap.set([headStripRef.current, footerRef.current], { autoAlpha: 0, y: -20 });
			const linkItems = linksRef.current?.querySelectorAll<HTMLLIElement>('li');
			if (linkItems) gsap.set(linkItems, { autoAlpha: 0, y: 60 });
		},
		{ scope: containerRef },
	);

	// ─── Open / reactive close animation ─────────────────────────────────────────
	useEffect(() => {
		if (!panelRef.current) return;

		if (open) {
			hasMountedOpen.current = true;

			// Cancel any in-flight close
			if (animatingClose.current) {
				if (tlRef.current) { tlRef.current.kill(); tlRef.current = null; }
				animatingClose.current = false;
			}

			if (panelRef.current) panelRef.current.scrollTop = 0;
			const linkItems = linksRef.current?.querySelectorAll<HTMLLIElement>('li');
			const reduce    = prefersReducedMotion();

			if (tlRef.current) { tlRef.current.kill(); tlRef.current = null; }

			if (reduce) {
				const tl = gsap.timeline();
				tlRef.current = tl;
				tl.to(panelRef.current, { yPercent: 0, duration: 0.3, ease: 'power2.out' });
				tl.to(
					[headStripRef.current, footerRef.current],
					{ y: 0, autoAlpha: 1, duration: 0.2 },
					'-=0.1',
				);
				if (linkItems?.length) {
					tl.to(linkItems, { y: 0, autoAlpha: 1, duration: 0.2 }, '-=0.15');
				}
			} else {
				const tl = gsap.timeline();
				tlRef.current = tl;
				tl.to(flashRef.current, { scaleY: 1, autoAlpha: 1, duration: 0.32, ease: 'power3.in' });
				tl.to(panelRef.current, { yPercent: 0, duration: 0.85, ease: 'power4.out', force3D: true }, '-=0.08');
				tl.to(flashRef.current, { autoAlpha: 0, duration: 0.25 }, '-=0.5');
				tl.to(headStripRef.current, { y: 0, autoAlpha: 1, duration: 0.5 }, '-=0.45');
				if (linkItems?.length) {
					tl.to(
						linkItems,
						{ y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.06, ease: 'power4.out' },
						'-=0.35',
					);
				}
				tl.to(footerRef.current, { y: 0, autoAlpha: 1, duration: 0.5 }, '-=0.35');
			}
		} else {
			// open=false driven by React state (not via runClose)
			if (!hasMountedOpen.current) return; // never opened — skip
			if (skipCloseEffect.current) {
				// runClose already ran — just reset the flag
				skipCloseEffect.current = false;
				return;
			}
			// Triggered by something that didn't go through runClose (e.g. parent reset)
			runClose();
		}
	}, [open, runClose]);

	// ─── Cursor-follow preview + edge auto-scroll loop ────────────────────────────
	useEffect(() => {
		if (!open) return;
		const reduce = prefersReducedMotion();
		const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

		const onPointerMove = (e: PointerEvent) => {
			pointerY.current = e.clientY;
		};
		window.addEventListener('pointermove', onPointerMove, { passive: true });

		const loop = () => {
			// Floating image preview follows the cursor
			currentPos.current.x = lerp(currentPos.current.x, targetPos.current.x, 0.18);
			currentPos.current.y = lerp(currentPos.current.y, targetPos.current.y, 0.18);
			if (imgWrapRef.current) {
				// The preview lives INSIDE the scrollable panel, so its absolute
				// origin scrolls with the content. The cursor coords are viewport-
				// relative — add the panel's scrollTop back so the image tracks the
				// cursor even when the list is scrolled (otherwise it drifts up by
				// scrollTop and vanishes off the top once you scroll down).
				const scrollY = panelRef.current?.scrollTop ?? 0;
				imgWrapRef.current.style.transform = `translate3d(${currentPos.current.x}px, ${currentPos.current.y + scrollY}px, 0) translate(-50%, -50%)`;
			}

			// Edge-zone auto-scroll — map cursor proximity to top/bottom into a
			// smoothed scroll velocity. The middle band is a dead-zone so links
			// stay hoverable without the panel creeping.
			const panel = panelRef.current;
			if (!reduce && panel && pointerY.current !== null) {
				const h = panel.clientHeight;
				const max = panel.scrollHeight - h;
				if (max > 4) {
					const edge = Math.min(h * 0.22, 220);
					const y = pointerY.current;
					let v = 0;
					if (y < edge) v = -(1 - y / edge);
					else if (y > h - edge) v = (y - (h - edge)) / edge;
					// quadratic ease → gentle near the band, quicker at the very edge
					const target = Math.sign(v) * v * v * 18;
					autoScrollV.current = lerp(autoScrollV.current, target, 0.12);
					if (Math.abs(autoScrollV.current) > 0.05) {
						panel.scrollTop = Math.max(
							0,
							Math.min(max, panel.scrollTop + autoScrollV.current),
						);
					}
				}
			}

			rafId.current = requestAnimationFrame(loop);
		};
		rafId.current = requestAnimationFrame(loop);
		return () => {
			window.removeEventListener('pointermove', onPointerMove);
			if (rafId.current) cancelAnimationFrame(rafId.current);
			pointerY.current = null;
			autoScrollV.current = 0;
		};
	}, [open]);

	const handleRowEnter = (key: string) => (event: MouseEvent<HTMLAnchorElement>) => {
		if (prefersReducedMotion()) return;
		currentPos.current = { x: event.clientX, y: event.clientY };
		targetPos.current  = { x: event.clientX, y: event.clientY };
		Object.entries(imageRefs.current).forEach(([k, el]) => {
			if (el) el.style.opacity = k === key ? '1' : '0';
		});
		if (imgInnerRef.current) {
			gsap.killTweensOf(imgInnerRef.current);
			gsap.fromTo(
				imgInnerRef.current,
				{ clipPath: 'inset(100% 0 0 0)', scale: 1.08 },
				{ clipPath: 'inset(0% 0 0 0)', scale: 1, duration: 0.55, ease: 'power3.out' },
			);
		}
	};

	const handleRowMove = (event: MouseEvent<HTMLAnchorElement>) => {
		targetPos.current = { x: event.clientX, y: event.clientY };
	};

	const handleRowLeave = () => {
		if (prefersReducedMotion()) return;
		if (imgInnerRef.current) {
			gsap.to(imgInnerRef.current, { clipPath: 'inset(100% 0 0 0)', duration: 0.35, ease: 'power3.in' });
		}
	};

	const handleLogout = () => {
		runClose(() => {
			dispatch(logoutAction(navigate));
			onClose();
		});
	};

	const visiblePrimary   = PRIMARY_LINKS.filter((l) => !l.authOnly || isLoggedIn);
	const visibleSecondary = SECONDARY_LINKS.filter((l) => {
		if (l.authOnly && !isLoggedIn) return false;
		if (l.instructorOnly && !isInstructor) return false;
		return true;
	});

	return (
		<div
			ref={containerRef}
			className={cn(
				'fixed inset-0 z-[60]',
				open ? 'pointer-events-auto' : 'pointer-events-none',
			)}
			aria-hidden={!open}
		>
			{/* Clay flash */}
			<div ref={flashRef} className='absolute inset-0 bg-clay-500' aria-hidden />

			{/* Main panel */}
			<div
				ref={panelRef}
				data-lenis-prevent
				className='absolute inset-0 bg-bg-base overflow-y-auto overscroll-contain'
				style={{ willChange: 'transform' }}
			>
				{/* Film grain */}
				<div
					aria-hidden
					className='pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay'
					style={{
						backgroundImage:
							"url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' /></filter><rect width='100%' height='100%' filter='url(%23n)' /></svg>\")",
					}}
				/>
				{/* Warm radial */}
				<div
					aria-hidden
					className='pointer-events-none absolute inset-0'
					style={{
						background:
							'radial-gradient(circle at 80% 10%, rgba(200,71,46,0.08), transparent 55%), radial-gradient(circle at 10% 90%, rgba(184,153,104,0.06), transparent 50%)',
					}}
				/>

				{/* Floating cursor-image preview */}
				<div
					ref={imgWrapRef}
					className='pointer-events-none absolute top-0 left-0 z-20 hidden lg:block'
					style={{ width: 'min(28vw, 360px)', height: 'min(36vw, 460px)', willChange: 'transform' }}
				>
					<div
						ref={imgInnerRef}
						className='relative w-full h-full overflow-hidden rounded-card shadow-warm-3'
						style={{ clipPath: 'inset(100% 0 0 0)' }}
					>
						{visiblePrimary.map((link) => (
							<img
								key={link.id}
								ref={(el) => { imageRefs.current[String(link.id)] = el; }}
								src={link.image}
								alt=''
								className='absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-200'
								loading='eager'
								decoding='async'
							/>
						))}
					</div>
				</div>

				{/* Top strip */}
				<div
					ref={headStripRef}
					className='relative z-30 max-w-screen-2xl mx-auto px-5 sm:px-10 lg:px-14 pt-6 sm:pt-8 flex items-center justify-between'
				>
					<Link to='/' className='inline-block' onClick={handleNavClick('/')}>
						<span
							className='font-display italic font-medium text-ink-primary tracking-[-0.02em]'
							style={{ fontSize: 'clamp(22px, 1.8vw, 28px)', fontVariationSettings: '"opsz" 36' }}
						>
							EduCourse
						</span>
					</Link>

					<button
						type='button'
						onClick={handleCloseButton}
						aria-label='Close menu'
						className='group inline-flex items-center gap-3 font-mono text-2xs uppercase tracking-[0.22em] text-ink-secondary hover:text-ink-primary transition-colors'
					>
						<span>Close</span>
						<span
							aria-hidden
							className='inline-grid place-items-center h-9 w-9 rounded-full border border-line-base group-hover:border-clay-500 transition-colors'
						>
							<Plus
								size={16}
								strokeWidth={2}
								className='rotate-45 transition-transform duration-base ease-out-quart group-hover:rotate-90 group-hover:text-clay-400'
							/>
						</span>
					</button>
				</div>

				{/* Primary nav links */}
				<div className='relative z-10 max-w-screen-2xl mx-auto px-5 sm:px-10 lg:px-14 pt-10 sm:pt-14'>
					<span className='font-mono text-2xs uppercase tracking-[0.22em] text-clay-400 block mb-6'>
						Menu · {visiblePrimary.length}
					</span>
					<ol ref={linksRef} className='border-t border-line-subtle'>
						{visiblePrimary.map((link) => (
							<li key={link.id} className='border-b border-line-subtle'>
								<NavLink
									to={link.path}
									end={link.path === '/'}
									onClick={handleNavClick(link.path)}
									onMouseEnter={handleRowEnter(String(link.id))}
									onMouseMove={handleRowMove}
									onMouseLeave={handleRowLeave}
									className={({ isActive }) =>
										`group relative flex items-baseline gap-6 py-4 sm:py-5 lg:py-6 transition-[padding] duration-base ease-out-quart hover:pl-4 ${
											isActive ? 'text-clay-400' : 'text-ink-primary'
										}`
									}
								>
									<span className='font-mono text-2xs uppercase tracking-[0.22em] text-ink-secondary tabular-nums shrink-0 w-8'>
										{link.num}
									</span>
									<span
										className='font-display font-semibold leading-[0.95] tracking-[-0.035em] flex items-baseline gap-3 flex-wrap'
										style={{
											fontSize: 'clamp(40px, 7.5vw, 112px)',
											fontVariationSettings: '"opsz" 144',
										}}
									>
										<span className='transition-colors duration-base group-hover:text-clay-400'>
											{link.name}
										</span>
										{link.accent && link.accent !== link.name && (
											<span
												className='font-display italic text-ink-secondary group-hover:text-ink-primary transition-colors duration-base'
												style={{ fontVariationSettings: '"opsz" 144', fontSize: 'clamp(20px, 2vw, 32px)' }}
											>
												— {link.accent}
											</span>
										)}
									</span>
									<ArrowUpRight
										size={28}
										strokeWidth={1.6}
										className='ml-auto self-center text-ink-tertiary translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-hover:text-clay-400 transition-[transform,opacity,color] duration-base ease-out-quart'
									/>
								</NavLink>
							</li>
						))}
					</ol>
				</div>

				{/* Footer rail */}
				<div
					ref={footerRef}
					className='relative z-10 max-w-screen-2xl mx-auto px-5 sm:px-10 lg:px-14 pt-12 pb-10'
				>
					<div className='grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12'>
						{/* Account / secondary */}
						<div className='lg:col-span-5'>
							<span className='font-mono text-2xs uppercase tracking-[0.22em] text-ink-secondary block mb-4'>
								{isLoggedIn ? 'Account' : 'Get started'}
							</span>
							{isLoggedIn ? (
								<ul className='flex flex-wrap gap-x-6 gap-y-2'>
									{visibleSecondary.map((link) => (
										<li key={link.id}>
											<Link
												to={link.path}
												onClick={handleNavClick(link.path)}
												className='font-body text-base text-ink-primary hover:text-clay-400 transition-colors'
											>
												{link.name}
											</Link>
										</li>
									))}
									<li>
										<button
											type='button'
											onClick={handleLogout}
											className='font-body text-base text-ink-secondary hover:text-clay-400 transition-colors'
										>
											Log out
										</button>
									</li>
								</ul>
							) : (
								<div className='flex items-center gap-3 flex-wrap'>
									<Link
										to='/signin'
										onClick={handleNavClick('/signin')}
										className='inline-flex items-center h-11 px-5 rounded-pill border border-line-base text-ink-primary hover:border-clay-500 hover:text-clay-400 transition-colors font-body text-sm'
									>
										Sign in
									</Link>
									<Link
										to='/signup'
										onClick={handleNavClick('/signup')}
										className='inline-flex items-center gap-2 h-11 px-6 rounded-pill bg-clay-500 hover:bg-clay-600 text-ink-primary font-body font-medium text-sm transition-colors'
									>
										Create account
										<ArrowUpRight size={14} strokeWidth={2} />
									</Link>
								</div>
							)}
						</div>

						{/* Contact */}
						<div className='lg:col-span-4'>
							<span className='font-mono text-2xs uppercase tracking-[0.22em] text-ink-secondary block mb-4'>
								Reach out
							</span>
							<a
								href='mailto:hello@educourse.io'
								className='font-display italic text-2xl text-ink-primary hover:text-clay-400 transition-colors block leading-tight'
								style={{ fontVariationSettings: '"opsz" 36' }}
							>
								hello@educourse.io
							</a>
							<p className='mt-2 font-body text-xs text-ink-secondary'>
								Lagos · Remote-first · GMT+1
							</p>
						</div>

						{/* Socials */}
						<div className='lg:col-span-3'>
							<span className='font-mono text-2xs uppercase tracking-[0.22em] text-ink-secondary block mb-4'>
								Follow
							</span>
							<div className='flex items-center gap-2'>
								{SOCIAL_LINKS.map((s) => (
									<a
										key={s.label}
										href={s.href}
										target='_blank'
										rel='noopener noreferrer'
										className='inline-grid place-items-center h-10 w-10 rounded-full border border-line-base text-ink-primary hover:border-clay-500 hover:text-clay-400 transition-colors font-mono text-2xs'
									>
										{s.label}
									</a>
								))}
							</div>
						</div>
					</div>

					<div className='mt-10 pt-6 border-t border-line-subtle flex items-center justify-between font-mono text-2xs uppercase tracking-[0.22em] text-ink-tertiary'>
						<span>© {new Date().getFullYear()} EduCourse</span>
						<span>Built in Lagos · Made with care</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MenuOverlay;
