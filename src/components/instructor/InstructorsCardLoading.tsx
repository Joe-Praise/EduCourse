const InstructorsCardLoading = () => {
	return (
		<div className='w-52 flex flex-col items-center justify-center m-2 p-1 hover:scale-105 duration-150 bg-gray-200'>
			<div className='block w-44 h-44 rounded-full bg-gray-400'></div>
			<div className='w-full text-center mt-2'>
				<div className='my-2'>
					<div className='w-1/2 h-4 mx-auto mt-3 rounded-full bg-gray-400 shadow'></div>
					<div className='w-1/2 h-4 mx-auto mt-3 rounded-full bg-gray-400 shadow'></div>
				</div>

				<div
					className={`h-4 w-11/12 mx-auto flex justify-center gap-3 my-4 pt-2 border-t`}
				>
					<div className='flex items-center gap-1 h-4 w-[45%] rounded-full bg-gray-400 shadow'></div>

					<div className='flex items-center gap-1 h-4 w-[45%] rounded-full bg-gray-400 shadow'></div>
				</div>
			</div>
		</div>
	);
};

export default InstructorsCardLoading;
