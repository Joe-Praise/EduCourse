import { RefObject, useEffect, useRef } from 'react';
import { prefersReducedMotion } from './motion';

interface EdgeAutoScrollOptions {
	/** Size of the top/bottom hot-zone as a fraction of the element height. */
	edgeRatio?: number;
	/** Hard cap (px) on the hot-zone size, so tall panels don't get huge zones. */
	maxEdge?: number;
	/** Peak scroll speed in px/frame at the very edge. */
	maxSpeed?: number;
}

/**
 * Mouse-position-driven auto-scroll for an overflowing element.
 *
 * While `active`, moving the cursor into the top or bottom hot-zone of the
 * referenced element glides it in that direction — the speed eases up the
 * closer you get to the edge, and a centre dead-zone keeps items hoverable.
 * Gives a scrollable menu/list the same "follow-the-cursor" feel as the
 * image-trail nav, without needing the scroll wheel.
 *
 * Honours `prefers-reduced-motion` (no-op when set). Only fires while the
 * pointer is actually over the element (both axes), so it never hijacks scroll
 * for content elsewhere on screen.
 */
export function useEdgeAutoScroll(
	ref: RefObject<HTMLElement>,
	active: boolean,
	{ edgeRatio = 0.22, maxEdge = 180, maxSpeed = 16 }: EdgeAutoScrollOptions = {},
): void {
	const pointer = useRef<{ x: number; y: number } | null>(null);
	const velocity = useRef(0);
	const rafId = useRef<number | null>(null);

	useEffect(() => {
		if (!active || prefersReducedMotion()) return;
		const el = ref.current;
		if (!el) return;

		const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

		const onMove = (e: PointerEvent) => {
			pointer.current = { x: e.clientX, y: e.clientY };
		};
		window.addEventListener('pointermove', onMove, { passive: true });

		const loop = () => {
			const node = ref.current;
			const p = pointer.current;
			if (node && p) {
				const rect = node.getBoundingClientRect();
				const max = node.scrollHeight - node.clientHeight;
				const inside =
					p.x >= rect.left && p.x <= rect.right && p.y >= rect.top && p.y <= rect.bottom;

				if (max > 4 && inside) {
					const h = rect.height;
					const edge = Math.min(h * edgeRatio, maxEdge);
					const y = p.y - rect.top;
					let v = 0;
					if (y < edge) v = -(1 - y / edge);
					else if (y > h - edge) v = (y - (h - edge)) / edge;
					// quadratic ease keeps the centre calm and the edges quick
					const target = Math.sign(v) * v * v * maxSpeed;
					velocity.current = lerp(velocity.current, target, 0.12);
					if (Math.abs(velocity.current) > 0.05) {
						node.scrollTop = Math.max(0, Math.min(max, node.scrollTop + velocity.current));
					}
				} else {
					velocity.current = lerp(velocity.current, 0, 0.12);
				}
			}
			rafId.current = requestAnimationFrame(loop);
		};
		rafId.current = requestAnimationFrame(loop);

		return () => {
			window.removeEventListener('pointermove', onMove);
			if (rafId.current) cancelAnimationFrame(rafId.current);
			pointer.current = null;
			velocity.current = 0;
		};
	}, [ref, active, edgeRatio, maxEdge, maxSpeed]);
}
