import { useCallback, useEffect, useRef, useState } from 'react';

type AnimateOut = (el: HTMLElement, done: () => void) => void;

interface UseExitAnimationResult<T extends HTMLElement> {
	mounted: boolean;
	ref: (node: T | null) => void;
}

export function useExitAnimation<T extends HTMLElement = HTMLElement>(
	visible: boolean,
	animateOut: AnimateOut,
): UseExitAnimationResult<T> {
	const [mounted, setMounted] = useState<boolean>(visible);
	const nodeRef = useRef<T | null>(null);
	const animateOutRef = useRef<AnimateOut>(animateOut);

	useEffect(() => {
		animateOutRef.current = animateOut;
	}, [animateOut]);

	useEffect(() => {
		if (visible) {
			setMounted(true);
			return;
		}
		const node = nodeRef.current;
		if (!node) {
			setMounted(false);
			return;
		}
		animateOutRef.current(node, () => setMounted(false));
	}, [visible]);

	const ref = useCallback((node: T | null) => {
		nodeRef.current = node;
	}, []);

	return { mounted, ref };
}
