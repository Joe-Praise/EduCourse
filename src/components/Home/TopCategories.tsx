import { useEffect } from 'react';
import { CardsPlaceholder, TopCategoryCard } from './';
import { AppDispatch } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { getCategoryAction } from '../../redux/actions/categoryAction';
import { RootState } from '../../redux/reducers';
import { LoadingEffect } from '../shared';
import { categoryType } from '../../redux/api/categoryApi';
import { capitalizeFirstLetters } from '../../util/helperFunctions/helper';

const TopCategories = () => {
	const dispatch: AppDispatch = useDispatch();
	const categories = useSelector(
		(state: RootState) => state.category.categories
	);
	// const categories: topCategoryCardType[] = [
	// 	{
	// 		title: 'Art and Design',
	// 		total: '17',
	// 	},
	// 	{
	// 		title: 'Marketing',
	// 		total: '50',
	// 	},
	// 	{
	// 		title: 'Mathematics',
	// 		total: '70',
	// 	},
	// 	{
	// 		title: 'Communication',
	// 		total: '14',
	// 	},
	// 	{
	// 		title: 'Programming',
	// 		total: '200',
	// 	},
	// 	{
	// 		title: 'Building & construction',
	// 		total: '10',
	// 	},
	// 	{
	// 		title: 'Finance',
	// 		total: '150',
	// 	},
	// 	{
	// 		title: 'Science',
	// 		total: '700',
	// 	},
	// 	{
	// 		title: 'Network',
	// 		total: '120',
	// 	},
	// 	{
	// 		title: 'Videography',
	// 		total: '1',
	// 	},
	// ];

	useEffect(() => {
		const details = {
			page: '1',
			limit: '6',
		};
		dispatch(getCategoryAction(details, 'course'));
	}, [dispatch]);

	const handleCategoryDisplay = () => {
		if (categories?.data?.length < 1) {
			return (
				<div>
					<LoadingEffect />
				</div>
			);
		} else {
			return (
				<CardsPlaceholder
					className='grid-cols-2 sm:grid-cols-3 gap-4'
					title={'Top Categories'}
					description={'Explore our Popular Categories'}
					path={'/'}
					btnValue={'All Categories'}
				>
					<>
						{categories?.data?.map((el: categoryType) => {
							// if (id <= 9) {
							return (
								<TopCategoryCard
									key={el._id}
									title={capitalizeFirstLetters(el.name)}
								/>
							);
							// }
						})}
					</>
				</CardsPlaceholder>
			);
		}
	};

	return <div>{handleCategoryDisplay()}</div>;
};

export default TopCategories;
