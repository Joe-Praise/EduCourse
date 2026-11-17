/**
 * Return-to-page after sign in / sign up.
 *
 * The page a visitor came from travels as `?redirect=<path>` on /signin and
 * /signup (and between them), so it survives a reload and the sign-up → sign-in
 * hop. Only same-site paths are honoured — a crafted `?redirect=//evil.com`
 * link can't bounce someone off-site after they sign in.
 */

export const REDIRECT_PARAM = 'redirect';

const AUTH_PAGES = new Set(['/signin', '/signup']);

/** A same-site path to return to, or null if `raw` isn't one. */
export function safeRedirect(raw: string | null | undefined): string | null {
	if (!raw || !raw.startsWith('/') || raw.startsWith('//') || raw.startsWith('/\\')) return null;
	const path = raw.split(/[?#]/)[0];
	return AUTH_PAGES.has(path) ? null : raw;
}

/** `/signin` or `/signup`, carrying `returnTo` when it's a safe path. */
export function authPath(kind: 'signin' | 'signup', returnTo?: string | null): string {
	const safe = safeRedirect(returnTo);
	// Home is already where sign-in lands by default — keep that URL clean.
	return safe && safe !== '/' ? `/${kind}?${REDIRECT_PARAM}=${encodeURIComponent(safe)}` : `/${kind}`;
}

/** The safe return path carried in a location's query string, if any. */
export function redirectFromSearch(search: string): string | null {
	return safeRedirect(new URLSearchParams(search).get(REDIRECT_PARAM));
}
