module.exports = {
	root: true,
	env: { browser: true, es2020: true },
	extends: [
		'eslint:recommended',
		// 'plugin:@typescript-eslint/recommended-type-checked',
		'plugin:react-hooks/recommended',
		'plugin:react/recommended',
		'plugin:react/jsx-runtime',
	],
	ignorePatterns: ['dist', '.eslintrc.cjs'],
	parser: '@typescript-eslint/parser',
	plugins: ['react-refresh'],
	rules: {
		'react-refresh/only-export-components': [
			'warn',
			{ allowConstantExport: true },
		],
		'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
	},
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
		project: ['./tsconfig.json', './tsconfig.node.json'],
		tsconfigRootDir: __dirname,
	},
	settings: {
		tailwindcss: {
			config: 'tailwind.config.js',
		},
	},
};
