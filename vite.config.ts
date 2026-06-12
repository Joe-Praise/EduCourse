import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
	plugins: [
		react(),
		// Generate a bundle treemap at dist/stats.html on every production build.
		// Open dist/stats.html after `npm run build` to see chunk sizes (gzip + br).
		// Baseline for future optimization work — code-splitting, lazy imports.
		mode === 'production' &&
			visualizer({
				filename: 'dist/stats.html',
				template: 'treemap',
				gzipSize: true,
				brotliSize: true,
			}),
	].filter(Boolean),
}));
