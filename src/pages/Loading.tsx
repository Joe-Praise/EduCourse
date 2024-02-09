const Loading = () => {
	return (
		<div className='flex justify-center items-center fixed inset-0'>
			<div className='loader'>
				<div className='loader__bar'></div>
				<div className='loader__bar'></div>
				<div className='loader__bar'></div>
				<div className='loader__bar'></div>
				<div className='loader__bar'></div>
				<div className='loader__ball'></div>
			</div>
		</div>
	);
};

export default Loading;
