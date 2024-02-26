import { FC, useCallback, useEffect, useState } from 'react';
import { metaData, paginateType } from '../../redux/sharedTypes';

interface Iprop {
	handlePagination: (_details: paginateType, _queryStr: string) => void;
	metaData: metaData;
	queryString: string;
}

const Pagination: FC<Iprop> = (props) => {
	const { metaData, handlePagination, queryString } = props;
	const [pages, setPages] = useState<number[]>([]);
	const [activePage, setActivePage] = useState(metaData?.page || 1);
	// const [details, setDetails] = useState<paginateType>({
	// 	page: '',
	// 	limit: '6',
	// });
	// const dataPerPage = metaData.limit;

	//saving the page count
	// const pageCount = Math.ceil(data.length / dataPerPage);
	const pageCount = metaData?.totalPages;

	// this gets the total items viewed
	// const itemsViewed = activePage * dataPerPage;

	// this uses the array method to limit the movie on dsiplay
	// const displayData = data.slice(itemsViewed, itemsViewed + dataPerPage);
	// console.log(displayData);

	const buildPages = useCallback(() => {
		let start = 1,
			end = pageCount < 5 ? pageCount : 5;

		if (activePage > 3 && activePage < pageCount - 3) {
			start = activePage - 2;
			end = activePage + 2;
		}

		if (pageCount > 5 && activePage > pageCount - 5) {
			start = pageCount - 5;
			end = pageCount;
		}

		const newPages = [];
		for (let i = start; i <= end; i++) {
			newPages.push(i);
		}

		setPages(newPages);
	}, [activePage, pageCount]);

	// sets page and triggers pagination call
	const onChange = (page: number) => {
		setActivePage(page);
		const details = {
			page: page + '',
			limit: '6',
		};

		return handlePagination(details, queryString);
	};

	const isActive = (page: number) => (activePage === page ? 'active' : '');

	useEffect(() => buildPages(), [activePage, buildPages]);
	return (
		<div>
			<div className='flex gap-2 justify-center mt-5'>
				{activePage > 3 && (
					<button
						onClick={() => onChange(1)}
						className={`${isActive(
							pageCount
						)} w-9 h-9 border rounded-full flex justify-center items-center cursor-pointer duration-150 hover:bg-black hover:text-white`}
					>
						{1}
					</button>
				)}
				{activePage >= 4 && <span>...</span>}
				{pages.map((page) => (
					<button
						key={page}
						className={`${isActive(
							page
						)} w-9 h-9 border rounded-full flex justify-center items-center cursor-pointer duration-150 hover:bg-black hover:text-white`}
						onClick={() => onChange(page)}
					>
						{page}
					</button>
				))}
				{activePage < pageCount - 4 && <span>...</span>}
				{pageCount > 5 && activePage < pageCount && (
					<button
						className={`${isActive(
							pageCount
						)} w-9 h-9 border rounded-full flex justify-center items-center cursor-pointer duration-150 hover:bg-black hover:text-white`}
						onClick={() => onChange(pageCount)}
					>
						{pageCount}
					</button>
				)}
			</div>
		</div>
	);
};

export default Pagination;
