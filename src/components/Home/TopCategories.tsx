import { CardsPlaceholder, TopCategoryCard } from './';
import { CategoryCardLoading } from '../shared';
import {
	OmittedCategoryDataType,
	categoryType,
} from '../../redux/api/categoryApi';
import { capitalizeFirstLetters } from '../../util/helperFunctions/helper';
import { LoadingPulse } from '../shared';

interface Iprop {
	categories: categoryType[];
}

const TopCategories = (props: Iprop) => {
	const categories = props.categories;

	const arr = Array.from({ length: 6 }, (_v, i) => i);

	const handleCategoryDisplay = () => {
		if (!categories) {
			return (
				<>
					{arr.map((_, index) => {
						if (index <= 6) {
							return (
								<LoadingPulse key={`category_Card_${index}`}>
									<CategoryCardLoading />
								</LoadingPulse>
							);
						}
					})}
				</>
			);
		} else {
			return (
				<>
					{categories?.map((el: OmittedCategoryDataType) => {
						return (
							<TopCategoryCard
								key={el._id}
								title={capitalizeFirstLetters(el.name)}
							/>
						);
					})}
				</>
			);
		}
	};

	return (
		<div>
			<CardsPlaceholder
				className='grid-cols-2 sm:grid-cols-3 gap-4'
				title={'Top Categories'}
				description={'Explore our Popular Categories'}
				path={'/'}
				btnValue={'All Categories'}
			>
				{handleCategoryDisplay()}
			</CardsPlaceholder>
		</div>
	);
};

export default TopCategories;
