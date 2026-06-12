import { useCallback, useEffect, useState } from 'react';

interface UseFocusModeResult {
	focused: boolean;
	toggle: () => void;
	enable: () => void;
	disable: () => void;
}

export function useFocusMode(initial: boolean = false): UseFocusModeResult {
	const [focused, setFocused] = useState<boolean>(initial);

	const toggle = useCallback(() => setFocused((v) => !v), []);
	const enable = useCallback(() => setFocused(true), []);
	const disable = useCallback(() => setFocused(false), []);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			const target = e.target as HTMLElement | null;
			const tag = target?.tagName;
			if (tag === 'INPUT' || tag === 'TEXTAREA' || target?.isContentEditable) return;
			if (e.key === 'f' || e.key === 'F') {
				e.preventDefault();
				setFocused((v) => !v);
			}
			if (e.key === 'Escape' && focused) {
				e.preventDefault();
				setFocused(false);
			}
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [focused]);

	return { focused, toggle, enable, disable };
}
