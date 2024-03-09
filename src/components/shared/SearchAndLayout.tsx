import { ChangeEvent } from 'react';
import { IoGridSharp } from 'react-icons/io5';
import { FaList } from 'react-icons/fa';
import { FaFilter } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
// import { setFilter } from '../redux/reducers/courseSlice';
import { setFilter } from '../../redux/actions/courseAction';
import { autocompleteType } from '../../redux/api/courseAPI';

// import { stateBoolean } from '../pages/Courses/types/courseType';
interface Iprop {
	handleSearch: (_: ChangeEvent<HTMLInputElement>) => void;
	handleLayout: (_: string) => void;
	activeLayout: string;
	autocomplete: autocompleteType[];
	redirectFunc: (_: autocompleteType) => void;
}

const SearchAndLayout = (props: Iprop) => {
	const {
		handleSearch,
		handleLayout,
		activeLayout,
		autocomplete,
		redirectFunc,
	} = props;
	const dispatch = useDispatch();

	const handleDisplayFilterMenu = async () => {
		dispatch(setFilter());
	};

	// handle

	const handleAutoCompleteDisplay = () => {
		if (autocomplete.length) {
			return (
				<ul className='absolute bg-white w-full'>
					{autocomplete?.map((item) => {
						return (
							<li
								key={item._id}
								className='cursor-pointer border-t border-b p-4 px-2  text-sm'
								onClick={() => redirectFunc(item)}
							>
								{item.title}
							</li>
						);
					})}
				</ul>
			);
		}
	};

	return (
		<div className='flex gap-3 mt-2 items-center basis-80 border-3 border-red-500'>
			<div className='flex-1'>
				<form>
					<input
						type='text'
						name='search'
						id='headerSearch'
						placeholder='Search'
						className='searchInput rounded-none w-full'
						onChange={(e) => handleSearch(e)}
					/>
				</form>
				<div className='relative'>{handleAutoCompleteDisplay()}</div>
			</div>
			<div className='flex items-end gap-2'>
				<button>
					<IoGridSharp
						className={`w-7 cursor-pointer ${
							activeLayout === 'grid' ? 'fill-effect-active' : ''
						}`}
						onClick={() => handleLayout('grid')}
					/>
				</button>
				<button>
					<FaList
						className={`w-7 cursor-pointer ${
							activeLayout === 'list' ? 'fill-effect-active' : ''
						}`}
						onClick={() => handleLayout('list')}
					/>
				</button>
			</div>
			<div className='flex sm:hidden' onClick={handleDisplayFilterMenu}>
				<p>Filter</p>
				<FaFilter />
			</div>
		</div>
	);
};

export default SearchAndLayout;
