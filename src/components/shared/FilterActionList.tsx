import FilterActionBtn from './FilterActionBtn';

const FilterActionList = () => {
	const arr = Array.from(Array(6), () => 0);
	return (
		<ul className='list-none w-full'>
			{arr.map((_, idx) => {
				return <FilterActionBtn key={idx} />;
			})}
		</ul>
	);
};

export default FilterActionList;
