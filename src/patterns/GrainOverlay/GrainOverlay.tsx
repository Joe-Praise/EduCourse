/**
 * GrainOverlay — fixed-position SVG noise layer that gives the app a tactile film feel.
 * Mounted once at the app root. Pointer-events: none so it never intercepts clicks.
 * The noise is generated server-side as a deterministic SVG (no runtime work, no CLS).
 */

const GRAIN_SVG =
	"data:image/svg+xml;utf8," +
	encodeURIComponent(`
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'>
  <filter id='n'>
    <feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/>
    <feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0'/>
  </filter>
  <rect width='200' height='200' filter='url(#n)' opacity='1'/>
</svg>`);

export const GrainOverlay = () => (
	<div
		aria-hidden
		className='pointer-events-none fixed inset-0 z-[60] opacity-[0.04] mix-blend-overlay'
		style={{
			backgroundImage: `url("${GRAIN_SVG}")`,
			backgroundRepeat: 'repeat',
			backgroundSize: '200px 200px',
		}}
	/>
);
