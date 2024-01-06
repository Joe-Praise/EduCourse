/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			colors: {
				secondary: {
					light: '#0023339c',
					dark: '#002333',
				},
				'primary-color': '#deefe7',
				'tertiary-color': '#d5e2f2',
				effect: {
					hover: '#716C69',
					active: '#45A5CD',
					focus: '#335664',
				},
			},
		},
		fontFamily: {
			exo: ['"Exo", "sans-serif"'],
			jost: ['"Jost", "sans-serif"'],
		},
	},
	plugins: [],
};
