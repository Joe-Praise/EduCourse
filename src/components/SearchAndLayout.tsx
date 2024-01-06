import { ChangeEvent, FC } from 'react';
import { IoGridSharp } from 'react-icons/io5';
import { FaList } from 'react-icons/fa';

const SearchAndLayout: FC<{
	handleSearch: (e: ChangeEvent<HTMLInputElement>) => void;
	handleLayout: (value: string) => void;
}> = (props) => {
	return (
		<div className='flex gap-3'>
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
					className='w-7'
					onClick={() => props.handleLayout('grid')}
				/>
				<FaList className='w-7' onClick={() => props.handleLayout('list')} />
			</div>
		</div>
	);
};

export default SearchAndLayout;