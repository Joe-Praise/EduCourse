import { FilterActionList } from './';

interface Iprop {
	header: string;
	values: any[];
}

const FilterActionMenu = (props: Iprop) => {
	const { header, values } = props;
	return (
		<div className='w-[95%] mx-auto my-3'>
			<h1 className='text-sm'>{header}</h1>
			<FilterActionList values={values} header={header} />
		</div>
	);
};

export default FilterActionMenu;
