import { FC } from 'react';
import DetailsCard from './DetailsCard';

const Details: FC = () => {
	interface cardProps {
		total: string;
		title: string;
		role: string;
	}

	const details: cardProps[] = [
		{
			title: 'Active Students',
			total: '7000000',
			role: 'students',
		},
		{
			title: 'Total Courses',
			total: '400',
			role: 'courses',
		},
		{
			title: 'instructor',
			total: '100',
			role: 'instructor',
		},
		{
			title: 'Satisfactory Rate',
			total: '100',
			role: 'satisfaction',
		},
	];

	return (
		<div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
			{details.map((el, id) => {
				return (
					<DetailsCard
						key={id}
						title={el.title}
						total={el.total}
						role={el.role}
					/>
				);
			})}
		</div>
	);
};

export default Details;
