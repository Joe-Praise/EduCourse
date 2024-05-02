const CourseCardLoading = () => {
	return (
		<div
			className={`rounded-b-none rounded-full my-0 w-full px-0 shadow-lg shadow-slate-950 h-full bg-gray-200`}
		>
			<div className={`flex flex-col h-full `}>
				<div className='h-[12rem] w-full rounded-lg rounded-b-none bg-gray-400'></div>
				<div className='p-3 h-full shadow'>
					<div className='w-3/12 bg-gray-400 shadow rounded-full h-4 my-2'></div>
					<div className='my-1 h-4 w-9/12 rounded-full bg-gray-400 shadow'></div>

					<div className={`h-4 full rounded-full flex gap-3 my-2`}>
						<div className='flex items-center gap-1 h-4 w-24 rounded-full bg-gray-400 shadow'></div>

						<div className='flex items-center gap-1 h-4 w-24 rounded-full bg-gray-400 shadow'></div>
					</div>

					<div>
						<div className='w-auto mx-auto mt-3 h-[0.1rem] rounded-full bg-gray-400 shadow'></div>

						<div className='flex items-center justify-between mt-1 h-4 rounded-full '>
							<p className='h-4 w-3/12 rounded-full bg-gray-400 shadow'></p>

							<div className='h-4 w-3/12 rounded-full bg-gray-400 shadow'></div>
						</div>
					</div>
				</div>
				<div className='badge-loading shadow-md w-16 h-5'></div>
			</div>
		</div>
	);
};

export default CourseCardLoading;
