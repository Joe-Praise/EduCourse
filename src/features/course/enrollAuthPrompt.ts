import type { AuthPromptContent } from '../../components/shared/AuthPromptDialog';

/** Sign-in prompt shown when a signed-out visitor tries to enroll. Shared by the
 *  purchase panel and the floating enrollment pill so the copy stays in sync. */
export const enrollAuthPrompt = (courseTitle: string | undefined, isFree: boolean): AuthPromptContent => ({
	eyebrow: isFree ? 'Free course' : 'Enroll',
	title: isFree ? 'Sign in to start this course' : 'Sign in to enroll',
	message: `${courseTitle ? `“${courseTitle}” ` : 'This course '}will be saved to your account, along with your lesson progress and certificate.`,
});
