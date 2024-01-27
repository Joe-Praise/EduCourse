import { ChangeEvent, FC } from 'react';
import { IoGridSharp } from 'react-icons/io5';
import { FaList } from 'react-icons/fa';
import { FaFilter } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
// import { setFilter } from '../redux/reducers/courseSlice';
import { setFilter } from '../../redux/actions/courseAction';

// import { stateBoolean } from '../pages/Courses/types/courseType';

const SearchAndLayout: FC<{
	handleSearch: (e: ChangeEvent<HTMLInputElement>) => void;
	handleLayout: (value: string) => void;
	activeLayout: string;
}> = (props) => {
	const dispatch = useDispatch();

	const handleDisplayFilterMenu = async () => {
		dispatch(setFilter());
	};

	return (
		<div className='flex gap-3 mt-2 items-center'>
			<form>
				<input
					type='search'
					name='search'
					id='headerSearch'
					placeholder='Search'
					className='searchInput'
					onChange={(e) => props.handleSearch(e)}
				/>
			</form>
			<div className='flex items-end gap-2'>
				<IoGridSharp
					className={`w-7 cursor-pointer ${
						props.activeLayout === 'grid' ? 'fill-effect-active' : ''
					}`}
					onClick={() => props.handleLayout('grid')}
				/>
				<FaList
					className={`w-7 cursor-pointer ${
						props.activeLayout === 'list' ? 'fill-effect-active' : ''
					}`}
					onClick={() => props.handleLayout('list')}
				/>
			</div>
			<div className='flex sm:hidden' onClick={handleDisplayFilterMenu}>
				<p>Filter</p>
				<FaFilter />
			</div>
		</div>
	);
};

export default SearchAndLayout;
