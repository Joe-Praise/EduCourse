import { useSelector } from 'react-redux';
import YouTube, { YouTubeProps } from 'react-youtube';
import { RootState } from '../../redux/store';

interface VideoSectionProps {
	/**
	 * YouTube video id OR a YouTube URL. Falls back to `state.course.videoId`
	 * if not provided — kept for older callers that haven't migrated.
	 */
	videoId?: string;
	/** Called when the YT player reports the video has ended (state === 0). */
	onEnded?: () => void;
}

/**
 * Extract a YouTube video id from either a raw id, a long URL
 * (youtube.com/watch?v=ID), or a short URL (youtu.be/ID). Falls through
 * with the input if it doesn't look like a URL.
 */
const extractYouTubeId = (raw: string): string => {
	const watchMatch = raw.match(/[?&]v=([^&#]+)/);
	if (watchMatch) return watchMatch[1];
	const shortMatch = raw.match(/youtu\.be\/([^?&#]+)/);
	if (shortMatch) return shortMatch[1];
	const embedMatch = raw.match(/youtube\.com\/embed\/([^?&#]+)/);
	if (embedMatch) return embedMatch[1];
	return raw;
};

const VideoSection = ({ videoId, onEnded }: VideoSectionProps) => {
	const fallbackVideoId = useSelector((state: RootState) => state.course.videoId);
	const source = videoId || fallbackVideoId || '5oH9Nr3bKfw';
	const id = extractYouTubeId(source);

	const opts: YouTubeProps['opts'] = {
		height: '550',
		width: '100%',
		playerVars: {
			autoplay: 1,
			// rel: 0 keeps post-video suggestions scoped to the same channel
			rel: 0,
		},
	};

	const handleStateChange: YouTubeProps['onStateChange'] = (event) => {
		// YouTube IFrame API state codes: 0 = ENDED
		if (event.data === 0) onEnded?.();
	};

	return (
		<YouTube
			key={id}
			videoId={id}
			opts={opts}
			onStateChange={handleStateChange}
		/>
	);
};

export default VideoSection;
