import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		// Bundle treemap — opt-in only. Run `ANALYZE=true npm run build` to emit
		// dist/stats.html and inspect chunk sizes (gzip + brotli). It is skipped on
		// normal production deploys (Vercel / CI / Netlify): it's an analysis-only
		// artifact, and rollup-plugin-visualizer@7 relies on `import.meta.dirname`,
		// which is `undefined` on Node < 20.11 and crashes the build there — that is
		// what was failing Netlify's older Node.
		process.env.ANALYZE === 'true' &&
			visualizer({
				filename: 'dist/stats.html',
				template: 'treemap',
				gzipSize: true,
				brotliSize: true,
			}),
	].filter(Boolean),
});
