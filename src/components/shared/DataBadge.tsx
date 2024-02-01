import { IconType } from 'react-icons';

type data = {
	title: string;
	total: string;
	icon: IconType;
};

interface Iprop {
	dataDisplay: data[];
}

const DataBadge = (props: Iprop) => {
	const { dataDisplay } = props;
	return (
		<div className='flex items-center gap-3 my-1 flex-wrap'>
			{dataDisplay.map((el, idx) => {
				return (
					<div
						key={idx}
						className='flex basis-[45%] md:basis-auto items-center gap-1'
					>
						<el.icon className='fill-effect-active' />
						{el.total.length > 0 ? <span>{el.total}</span> : null}
						<span>{el.title}</span>
					</div>
				);
			})}
		</div>
	);
};

export default DataBadge;
