import { Link } from 'react-router-dom';

const Tags = () => {
	const tags: string[] = [
		'Free courses',
		'Marketing',
		'Idea',
		'LearnPress',
		'Instructor',
		'creators',
	];
	return (
		<div className='flex gap-2 item-center'>
			<p className='py-1'>Tags:</p>
			<div className='flex gap-2 md:gap-4 flex-wrap'>
				{tags.map((el, index) => (
					<Link
						to={''}
						key={index}
						className='border border-gray-500 px-2 py-1 w-[30%] md:w-28 text-center text-[13px]'
					>
						{el}
					</Link>
				))}
			</div>
		</div>
	);
};

export default Tags;
