const CategoryCardLoading = () => {
	return (
		<div
			className={`my-2 sm:my-0 h-[7.5rem] w-full  px-0 duration-150 rounded-lg shadow-slate-950 bg-gray-400`}
		>
			<div className='hover:text-effect-hover flex flex-col items-center justify-center h-full w-[80%] mx-auto text-center'>
				<div className='flex items-center justify-center gap-1 h-6 w-full rounded-full bg-gray-300  my-1'></div>
			</div>
		</div>
	);
};

export default CategoryCardLoading;
