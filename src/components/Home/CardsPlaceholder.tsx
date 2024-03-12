import { FC, ReactNode } from 'react';
import LinkBtn from '../shared/LinkBtn';

interface sectionProps {
	className: string;
	title: string;
	description: string;
	path: string;
	btnValue: string;
	children: ReactNode;
}

const CardsPlaceholder: FC<sectionProps> = (props) => {
	return (
		<section className='my-[5rem]'>
			<div className='flex justify-between items-center my-4'>
				<div>
					<h1>{props.title}</h1>
					<p>{props.description}</p>
				</div>
				<LinkBtn
					className='block py-1 hover:text-effect-hover hover:border-effect-hover'
					value={props.btnValue}
					path={props.path}
				/>
			</div>
			<div className={`grid my-3 ${props.className}`}>{props.children}</div>
		</section>
	);
};

export default CardsPlaceholder;
