export const space = {
	px: '1px',
	0: '0',
	0.5: '2px',
	1: '4px',
	1.5: '6px',
	2: '8px',
	3: '12px',
	4: '16px',
	5: '20px',
	6: '24px',
	8: '32px',
	10: '40px',
	12: '48px',
	16: '64px',
	20: '80px',
	24: '96px',
	32: '128px',
	40: '160px',
} as const;

export const radius = {
	none: '0',
	sm: '6px',
	md: '10px',
	lg: '14px',
	xl: '20px',
	'2xl': '28px',
	full: '9999px',
} as const;

export const motion = {
	duration: {
		fast: 0.12,
		base: 0.2,
		slow: 0.32,
		page: 0.48,
	},
	easing: {
		spring: 'back.out(1.6)',
		glide: 'power3.out',
		out: 'power2.out',
		inOut: 'power2.inOut',
	},
} as const;

export const zIndex = {
	base: 0,
	raised: 10,
	sticky: 20,
	overlay: 40,
	modal: 50,
	toast: 60,
	tooltip: 70,
} as const;

export const breakpoints = {
	sm: 640,
	md: 768,
	lg: 1024,
	xl: 1280,
	'2xl': 1536,
} as const;

export const layout = {
	container: {
		default: 1280,
		readable: 680,
	},
} as const;

export type SpaceToken = keyof typeof space;
export type RadiusToken = keyof typeof radius;
export type ZIndexToken = keyof typeof zIndex;
