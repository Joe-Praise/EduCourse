import { FC } from 'react';
import CardsPlaceholder from './CardsPlaceholder';
import { topCategoryCardType } from '../../pages/Home/homePageType';
import TopCategoryCard from './TopCategoryCard';

const TopCategories: FC = () => {
	const categories: topCategoryCardType[] = [
		{
			title: 'Art and Design',
			total: '17',
		},
		{
			title: 'Marketing',
			total: '50',
		},
		{
			title: 'Mathematics',
			total: '70',
		},
		{
			title: 'Communication',
			total: '14',
		},
		{
			title: 'Programming',
			total: '200',
		},
		{
			title: 'Building & construction',
			total: '10',
		},
		{
			title: 'Finance',
			total: '150',
		},
		{
			title: 'Science',
			total: '700',
		},
		{
			title: 'Network',
			total: '120',
		},
		{
			title: 'Videography',
			total: '1',
		},
	];
	return (
		<CardsPlaceholder
			className='grid-cols-2 sm:grid-cols-5 gap-4'
			title={'Top Categories'}
			description={'Explore our Popular Categories'}
			path={'/categories'}
			btnValue={'All Categories'}
		>
			<>
				{categories.map((el, id) => {
					if (id <= 9) {
						return (
							<TopCategoryCard key={id} title={el.title} total={el.total} />
						);
					}
				})}
			</>
		</CardsPlaceholder>
	);
};

export default TopCategories;
