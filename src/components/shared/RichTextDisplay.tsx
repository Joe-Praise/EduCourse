interface RichTextDisplayProps {
	html: string;
	className?: string;
}

/**
 * Renders sanitized HTML from rich-text fields (blog descriptions, instructor
 * bios, reviews, course descriptions). Content is sanitized server-side, so
 * it's safe to render directly.
 *
 * Intentionally unstyled: typography is owned by the calling context's prose
 * theme so a single component renders correctly inside warm-dark articles,
 * cards, and side panels alike.
 */
const RichTextDisplay = ({ html, className = '' }: RichTextDisplayProps) => {
	if (!html) return null;
	return (
		<div className={className} dangerouslySetInnerHTML={{ __html: html }} />
	);
};

export default RichTextDisplay;
