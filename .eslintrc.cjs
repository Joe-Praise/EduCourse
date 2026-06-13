module.exports = {
	root: true,
	env: { browser: true, es2020: true, node: true },
	extends: [
		'eslint:recommended',
		'plugin:react-hooks/recommended',
		'plugin:react/recommended',
		'plugin:react/jsx-runtime',
	],
	ignorePatterns: ['dist', '.eslintrc.cjs'],
	parser: '@typescript-eslint/parser',
	plugins: ['react-refresh', '@typescript-eslint'],
	settings: {
		react: { version: 'detect' },
	},
	rules: {
		'react-refresh/only-export-components': [
			'warn',
			{ allowConstantExport: true },
		],
		// `tsc --noEmit` (the typecheck step) is the source of truth for
		// undefined-symbol and unused detection. The base ESLint rules don't
		// understand TS types, UMD globals (`React`/`JSX` used in type position),
		// or type-only signature params, so they emit false positives. Defer to
		// TypeScript and its ESLint-aware equivalent instead.
		'no-undef': 'off',
		'no-unused-vars': 'off',
		'@typescript-eslint/no-unused-vars': [
			'error',
			{
				argsIgnorePattern: '^_',
				varsIgnorePattern: '^_',
				caughtErrorsIgnorePattern: '^_',
			},
		],
		// Apostrophes/quotes in JSX text render correctly; escaping them to
		// HTML entities only adds noise to the source.
		'react/no-unescaped-entities': 'off',
	},
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
};
