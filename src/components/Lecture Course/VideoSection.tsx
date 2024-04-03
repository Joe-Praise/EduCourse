// const VideoSection = () => {
// 	const videoId = '5oH9Nr3bKfw';
// 	return (
// 		<div>
// 			<iframe
// 				width='100%'
// 				height='550px'
// 				src={`https://www.youtube.com/embed/${videoId}?si=GeooVdwNmT8LodxB`}
// 				title='YouTube video player'
// 				allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
// 				allowFullScreen
// 			></iframe>
// 			{/* <video width='320' height='240' autoPlay>
// 				<source src='https://www.youtube.com/embed/favjC6EKFgw?si=GeooVdwNmT8LodxB' type='video/mp4' />
// 				<source src='https://www.youtube.com/embed/favjC6EKFgw?si=GeooVdwNmT8LodxB' type='video/ogg' />
// 			</video> */}
// 		</div>
// 	);
// };

// export default VideoSection;

{
	/* <iframe width="560" height="315" src="https://www.youtube.com/embed/favjC6EKFgw?si=GeooVdwNmT8LodxB" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe> */
}

import { useSelector } from 'react-redux';
// ts
import YouTube, { YouTubeProps } from 'react-youtube';
import { RootState } from '../../redux/store';

// interface Iprop

const VideoSection = () => {
	const videoId = useSelector((state: RootState) => state.course.videoId);

	// If you want to auto change the course to the next video
	// get the duration save it in a state and keep track of the currentTime[programtically update the videoId accordingly]
	// const onPlayerReady: YouTubeProps['onReady'] = (event) => {
	// 	// access to player in all event handlers via event.target
	// 	const player = event.target;
	// 	// console.log('Duration', player.getDuration());
	// };

	// const onPlayerPlay: YouTubeProps['onPlay'] = (event) => {
	// 	// access to player in all event handlers via event.target
	// 	const player = event.target;
	// 	// console.log(player.getCurrentTime());
	// };

	// const onVideoStateChange: YouTubeProps['onStateChange'] = (event) => {
	// 	const player = event.target;
	// 	console.log(player.getDuration());
	// 	console.log(player.getCurrentTime());
	// 	if (event.data === 0) {
	// 		console.log('Data', event.data);
	// 	}
	// };

	const opts: YouTubeProps['opts'] = {
		height: '550',
		width: '100%',
		playerVars: {
			// autoplay: 1,
		},
	};

	return (
		<YouTube
			videoId={videoId || '5oH9Nr3bKfw'}
			opts={opts}
			// onReady={onPlayerReady}
			// onPlay={onPlayerPlay}
			// onStateChange={onVideoStateChange}
			className=''
		/>
	);
};

export default VideoSection;

{
	/* <YouTube
  videoId={string}                  // defaults -> ''
  id={string}                       // defaults -> ''
  className={string}                // defaults -> ''
  iframeClassName={string}          // defaults -> ''
  style={object}                    // defaults -> {}
  title={string}                    // defaults -> ''
  loading={string}                  // defaults -> undefined
  opts={obj}                        // defaults -> {}
  onReady={func}                    // defaults -> noop
  onPlay={func}                     // defaults -> noop
  onPause={func}                    // defaults -> noop
  onEnd={func}                      // defaults -> noop
  onError={func}                    // defaults -> noop
  onStateChange={func}              // defaults -> noop
  onPlaybackRateChange={func}       // defaults -> noop
  onPlaybackQualityChange={func}    // defaults -> noop
/> */
}
