import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	// resolve: {
	// 	alias: {
	// 		'@': path.resolve('src'),
	// 		'@store': path.resolve('src/store'),
	// 		'@styles': path.resolve('src/styles'),
	// 	},
	// },
});
