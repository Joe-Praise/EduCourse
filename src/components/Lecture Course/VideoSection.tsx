const VideoSection = () => {
	return (
		<div>
			<iframe
				width='100%'
				height='550px'
				src='https://www.youtube.com/embed/favjC6EKFgw?si=GeooVdwNmT8LodxB'
				title='YouTube video player'
				frameBorder='0'
				allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
				allowFullScreen
			></iframe>
			{/* <video width='320' height='240' autoPlay>
				<source src='https://www.youtube.com/embed/favjC6EKFgw?si=GeooVdwNmT8LodxB' type='video/mp4' />
				<source src='https://www.youtube.com/embed/favjC6EKFgw?si=GeooVdwNmT8LodxB' type='video/ogg' />
			</video> */}
		</div>
	);
};

export default VideoSection;

{
	/* <iframe width="560" height="315" src="https://www.youtube.com/embed/favjC6EKFgw?si=GeooVdwNmT8LodxB" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe> */
}
