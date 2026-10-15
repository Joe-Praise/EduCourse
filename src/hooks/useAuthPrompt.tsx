import { useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthPromptDialog, type AuthPromptContent } from '../components/shared/AuthPromptDialog';
import { authPath } from '../util/helperFunctions/authRedirect';

interface PromptRequest extends AuthPromptContent {
	/** Runs only when the visitor chooses to sign in or sign up (not on "Not now"),
	 *  e.g. to remember an action to resume once they're back. */
	onProceed?: () => void;
}

/**
 * Gate an action behind an account without throwing the visitor off the page.
 *
 *   const { promptSignIn, authPrompt } = useAuthPrompt();
 *   if (!isSignedIn) return promptSignIn({ title, message });
 *   …
 *   return <>{…}{authPrompt}</>;
 *
 * Sign in / Create an account carry the current page as `?redirect=`, so the
 * visitor lands back here once they're done.
 */
export function useAuthPrompt() {
	const navigate = useNavigate();
	const location = useLocation();
	const [request, setRequest] = useState<PromptRequest | null>(null);

	const promptSignIn = useCallback((next: PromptRequest) => setRequest(next), []);
	const close = useCallback(() => setRequest(null), []);

	const proceed = (kind: 'signin' | 'signup') => {
		request?.onProceed?.();
		setRequest(null);
		navigate(authPath(kind, `${location.pathname}${location.search}`));
	};

	const authPrompt = (
		<AuthPromptDialog
			open={request !== null}
			content={request}
			onSignIn={() => proceed('signin')}
			onSignUp={() => proceed('signup')}
			onClose={close}
		/>
	);

	return { promptSignIn, authPrompt };
}
