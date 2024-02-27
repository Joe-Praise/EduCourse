import { Link } from 'react-router-dom';

interface Iprop {
	tags: { _id: string; name: string }[];
}
const Tags = (props: Iprop) => {
	const { tags } = props;

	return (
		<div className='flex gap-2 item-center'>
			<p className='py-1'>Tags:</p>
			<div className='flex gap-2 md:gap-4 flex-wrap'>
				{tags.map((el) => (
					<Link to={''} key={el._id} className='tag'>
						{el.name}
					</Link>
				))}
			</div>
		</div>
	);
};

export default Tags;
