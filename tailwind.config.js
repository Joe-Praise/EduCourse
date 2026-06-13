/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			colors: {
				// Legacy v0 tokens (kept so untouched legacy components don't break)
				secondary: {
					light: '#c4b5fd',
					dark: '#080814',
				},
				'tertiary-color': '#1e1a2e',
				'primary-color': '#8b5cf6',
				effect: {
					hover: '#7c3aed',
					active: '#a855f7',
					focus: '#5b21b6',
				},
				surface: '#0f0f1a',
				NotFound: '#204283',

				// === v2 — Warm Cinematic Editorial palette ===
				// Surfaces (luminance ladder — warm dark, not blue-cold)
				bg: {
					base: '#13110F',
					raised: '#1B1916',
					sunken: '#0A0907',
					overlay: '#23201C',
					paper: '#FFFAF2',
				},
				// Borders (nearly invisible — luminance does the work)
				line: {
					subtle: 'rgba(245,239,227,0.06)',
					base: 'rgba(245,239,227,0.10)',
					strong: 'rgba(245,239,227,0.18)',
				},
				// Ink (5-step cream-warm)
				ink: {
					primary: '#F5EFE3',
					secondary: '#C8C1B0',
					tertiary: '#7A7468',
					muted: '#4D4842',
					inverse: '#13110F',
				},
				// Brand / accent — clay (terracotta), the primary CTA hue
				brand: {
					50: '#FBE9E3',
					100: '#F5C7B8',
					400: '#D86749',
					500: '#C8472E',
					600: '#A8371F',
					700: '#7E2615',
					glow: 'rgba(200,71,46,0.45)',
				},
				// Semantic aliases for clay / sienna / ivory (preferred for new code)
				clay: {
					50: '#FBE9E3',
					400: '#D86749',
					500: '#C8472E',
					600: '#A8371F',
				},
				sienna: {
					300: '#D2BC93',
					400: '#C0A57A',
					500: '#B89968',
					600: '#967950',
				},
				ivory: {
					300: '#F4EFD8',
					400: '#EDE6C4',
					500: '#E8DFB4',
				},
				// Signals — kept but warm-tinted slightly
				signal: {
					success: '#5B8F4C',
					warning: '#D4A24C',
					danger: '#C84A3A',
					info: '#5E7FA2',
				},
			},
			fontFamily: {
				// Legacy v0 (kept for backward compat)
				exo: ['"Exo"', 'sans-serif'],
				jost: ['"Jost"', 'sans-serif'],
				// v2 — editorial
				display: ['"Fraunces"', 'Georgia', 'serif'],
				body: ['"Inter Tight"', '"Inter"', 'system-ui', 'sans-serif'],
				mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
				// Italic-display alias (Fraunces optical-size shines at large sizes)
				editorial: ['"Fraunces"', 'Georgia', 'serif'],
			},
			fontSize: {
				'2xs': ['11px', { lineHeight: '1.4', letterSpacing: '0' }],
				// v2 fluid display — clamp-based
				'5xl': ['clamp(40px, 5vw, 56px)', { lineHeight: '1.05', letterSpacing: '-0.025em' }],
				'6xl': ['clamp(56px, 7vw, 80px)', { lineHeight: '1.0', letterSpacing: '-0.03em' }],
				'7xl': ['clamp(72px, 9vw, 120px)', { lineHeight: '0.95', letterSpacing: '-0.04em' }],
				'8xl': ['clamp(96px, 12vw, 168px)', { lineHeight: '0.92', letterSpacing: '-0.045em' }],
				'9xl': ['clamp(120px, 16vw, 220px)', { lineHeight: '0.9', letterSpacing: '-0.05em' }],
			},
			borderRadius: {
				card: '14px',
				surface: '20px',
				pill: '9999px',
			},
			boxShadow: {
				// Legacy v1 elev-* names — kept, swapped to warm tints
				'elev-1': '0 1px 0 rgba(245,239,227,0.04) inset',
				'elev-2':
					'0 12px 32px -12px rgba(0,0,0,0.7), 0 1px 0 rgba(245,239,227,0.05) inset',
				'elev-3':
					'0 32px 80px -16px rgba(0,0,0,0.8), 0 0 0 1px rgba(245,239,227,0.06)',
				'elev-glow':
					'0 0 0 1px rgba(200,71,46,0.4), 0 12px 40px -8px rgba(200,71,46,0.25)',
				'focus-ring': '0 0 0 2px #C8472E',
				// v2 — explicit warm aliases for new code
				'warm-1': '0 1px 0 rgba(245,239,227,0.04) inset',
				'warm-2':
					'0 12px 32px -12px rgba(0,0,0,0.7), 0 1px 0 rgba(245,239,227,0.05) inset',
				'warm-3':
					'0 32px 80px -16px rgba(0,0,0,0.8), 0 0 0 1px rgba(245,239,227,0.06)',
				clay:
					'0 0 0 1px rgba(200,71,46,0.4), 0 12px 40px -8px rgba(200,71,46,0.25)',
			},
			transitionTimingFunction: {
				spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
				glide: 'cubic-bezier(0.16, 1, 0.3, 1)',
				'ease-out-quart': 'cubic-bezier(0.25, 1, 0.5, 1)',
			},
			transitionDuration: {
				fast: '120ms',
				base: '200ms',
				slow: '320ms',
				page: '480ms',
			},
			maxWidth: {
				container: '1280px',
				readable: '680px',
			},
			backgroundImage: {
				'warm-radial':
					'radial-gradient(ellipse at top right, rgba(200,71,46,0.10) 0%, transparent 55%), radial-gradient(ellipse at bottom left, rgba(184,153,104,0.06) 0%, transparent 60%)',
			},
			keyframes: {
				shimmer: {
					'100%': { transform: 'translateX(100%)' },
				},
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
				slideUp: {
					'0%': { transform: 'translateY(20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' },
				},
				scaleIn: {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' },
				},
				glow: {
					'0%, 100%': { boxShadow: '0 0 20px rgba(200,71,46,0.3)' },
					'50%': { boxShadow: '0 0 40px rgba(200,71,46,0.6)' },
				},
				float: {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-6px)' },
				},
			},
			animation: {
				fadeIn: 'fadeIn 300ms ease-out',
				slideUp: 'slideUp 300ms ease-out',
				scaleIn: 'scaleIn 200ms ease-out',
				glow: 'glow 3s ease-in-out infinite',
				float: 'float 4s ease-in-out infinite',
			},
		},
	},
	plugins: [require('@tailwindcss/typography')],
};
