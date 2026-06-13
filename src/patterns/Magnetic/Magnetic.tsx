import { Children, cloneElement, isValidElement, useRef, type ReactElement } from 'react';
import { useMagnetic } from '../../lib/useMagnetic';

interface MagneticProps {
	strength?: number;
	radius?: number;
	children: ReactElement<{ ref?: React.Ref<HTMLElement> }>;
}

export const Magnetic = ({ strength = 0.3, radius = 120, children }: MagneticProps) => {
	const ref = useRef<HTMLElement>(null);
	useMagnetic(ref, { strength, radius });
	const child = Children.only(children);
	if (!isValidElement(child)) return child;
	return cloneElement(child, { ref });
};
