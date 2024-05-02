interface Iprop {
	title: string;
}

const TopCategoryCard = (props: Iprop) => {
	const { title } = props;
	return (
		<div className='my-2 sm:my-0 h-[7.5rem] w-full px-0 shadow-lg hover:scale-105 duration-150 rounded-lg cursor-pointer text-secondary-light'>
			<div className='hover:text-effect-hover flex flex-col items-center justify-center h-full w-[80%] mx-auto text-center'>
				<p className='text-lg font-bold my-1 flex justify-center'>{title}</p>
				{/* <p>
					{+props.total.length > 1
						? props.total + ' Courses'
						: props.total + ' Course'}
				</p> */}
			</div>
		</div>
	);
};

export default TopCategoryCard;
