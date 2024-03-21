import { ReactNode } from 'react';
import { LinkBtn } from '../shared';

interface Iprop {
	className: string;
	title: string;
	description: string;
	path: string;
	btnValue: string;
	children: ReactNode;
}

const CardsPlaceholder = (props: Iprop) => {
	const { className, title, description, path, btnValue, children } = props;
	return (
		<section className='my-[5rem]'>
			<div className='flex justify-between items-center my-4'>
				<div>
					<h1>{title}</h1>
					<p>{description}</p>
				</div>
				<LinkBtn
					className='block py-1 hover:text-effect-hover hover:border-effect-hover'
					value={btnValue}
					path={path}
				/>
			</div>
			<div className={`grid my-3 ${className}`}>{children}</div>
		</section>
	);
};

export default CardsPlaceholder;
